// src/components/Productos.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productosAPI, categoriasAPI } from '../services/api';
import '../styles/Productos.css';

function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos');               // todos | disponible | agotado
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [showCategorias, setShowCategorias] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  // -----------------------------------------------------------------
  // FETCH
  // -----------------------------------------------------------------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        // 1. Public list (only available products)
        productosAPI.getAll(),
        // 2. All categories (for the dropdown)
        categoriasAPI.getAll()
      ]);

      // The backend returns: { success: true, productos: [...] }
      setProductos(prodRes.productos || []);
      setCategorias(catRes.categorias || []);   // adjust if your categoria endpoint returns differently
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // DELETE (soft-delete → esta_disponible = 0)
  // -----------------------------------------------------------------
  const handleDeleteProducto = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;

    try {
      await productosAPI.delete(id);
      alert('Producto eliminado');
      fetchData();                 // refresh list
    } catch (err) {
      alert(err.message || 'Error al eliminar');
    }
  };

  const handleDeleteCategoria = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar categoría "${nombre}"?`)) return;

    try {
      await categoriasAPI.delete(id);
      alert('Categoría eliminada');
      fetchData();
    } catch (err) {
      alert(err.message || 'Error al eliminar categoría');
    }
  };

  // -----------------------------------------------------------------
  // FILTER LOGIC (unchanged, just use the new field names)
  // -----------------------------------------------------------------
  const productosFiltrados = productos.filter(p => {
    const matchFiltro = filtro === 'todos' ||
      (filtro === 'disponible' && p.esta_disponible) ||
      (filtro === 'agotado' && p.inventario === 0);

    const matchCategoria = filtroCategoria === 'todas' || p.id_categoria == filtroCategoria;

    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.nombre_negocio?.toLowerCase().includes(busqueda.toLowerCase());

    return matchFiltro && matchCategoria && matchBusqueda;
  });

  const formatPrice = (price) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);

  // -----------------------------------------------------------------
  // RENDER (only tiny field-name tweaks)
  // -----------------------------------------------------------------
  if (loading) return <div className="loading"><div className="spinner"></div><p>Cargando…</p></div>;

  return (
    <div className="productos-container">
      {/* … header unchanged … */}

      {!showCategorias ? (
        /* ---------- PRODUCTOS VIEW ---------- */
        <div className="productos-content">
          {/* stats – now use the fields returned by the new backend */}
          <div className="productos-stats">
            <div className="stat-card"><div className="stat-icon">Total</div><div className="stat-value">{productos.length}</div><div className="stat-label">Total Productos</div></div>
            <div className="stat-card"><div className="stat-icon">Disponibles</div><div className="stat-value">{productos.filter(p => p.esta_disponible).length}</div><div className="stat-label">Disponibles</div></div>
            <div className="stat-card"><div className="stat-icon">Gastronómicos</div><div className="stat-value">{productos.filter(p => p.categoria_tipo === 'gastronomica').length}</div><div className="stat-label">Gastronómicos</div></div>
            <div className="stat-card"><div className="stat-icon">Artesanales</div><div className="stat-value">{productos.filter(p => p.categoria_tipo === 'artesanal').length}</div><div className="stat-label">Artesanales</div></div>
          </div>

          {/* filtros … unchanged … */}

          <div className="productos-table-container">
            {productosFiltrados.length === 0 ? (
              <div className="empty-state"><p>No se encontraron productos</p></div>
            ) : (
              <table className="productos-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th>
                    <th>Inventario</th><th>Oferente</th><th>Estado</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map(p => (
                    <tr key={p.id_producto}>
                      <td>{p.id_producto}</td>
                      <td className="producto-imagen">
                        {p.imagen && p.imagen.length ? <img src={p.imagen[0]} alt={p.nombre} /> : <div className="no-imagen">No image</div>}
                      </td>
                      <td className="producto-nombre"><strong>{p.nombre}</strong><small>{p.descripcion?.substring(0,50)}…</small></td>
                      <td><span className={`badge badge-${p.categoria_tipo}`}>{p.categoria_nombre || '—'}</span></td>
                      <td className="precio">{formatPrice(p.precio)}</td>
                      <td className={`inventario ${p.inventario===0?'agotado':''}`}>{p.inventario} uds</td>
                      <td>{p.nombre_negocio}</td>
                      <td>{p.esta_disponible ? <span className="estado disponible">Disponible</span> : <span className="estado no-disponible">No disponible</span>}</td>
                      <td className="actions">
                        <Link to={`/productos/editar/${p.id_producto}`} className="btn-action btn-edit">Edit</Link>
                        <button onClick={() => handleDeleteProducto(p.id_producto, p.nombre)} className="btn-action btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        // Vista de Categorías
        <div className="categorias-content">
          <div className="categorias-header">
            <h2>🏷️ Gestión de Categorías</h2>
            <Link to="/categorias/crear" className="btn btn-primary">
              + Nueva Categoría
            </Link>
          </div>

          {/* Estadísticas de Categorías */}
          <div className="productos-stats">
            <div className="stat-card">
              <div className="stat-icon">🏷️</div>
              <div className="stat-value">{categorias.length}</div>
              <div className="stat-label">Total Categorías</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🍽️</div>
              <div className="stat-value">
                {categorias.filter(c => c.tipo === 'gastronomica').length}
              </div>
              <div className="stat-label">Gastronómicas</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎨</div>
              <div className="stat-value">
                {categorias.filter(c => c.tipo === 'artesanal').length}
              </div>
              <div className="stat-label">Artesanales</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-value">
                {categorias.reduce((acc, cat) => acc + (cat.total_productos || 0), 0)}
              </div>
              <div className="stat-label">Productos Totales</div>
            </div>
          </div>

          {/* Tabla de Categorías */}
          <div className="productos-table-container">
            <table className="productos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Productos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => {
                  const productosEnCategoria = productos.filter(p => p.id_categoria === categoria.id_categoria).length;
                  return (
                    <tr key={categoria.id_categoria}>
                      <td>{categoria.id_categoria}</td>
                      <td>
                        <strong>{categoria.nombre}</strong>
                      </td>
                      <td>
                        <span className={`badge badge-${categoria.tipo}`}>
                          {categoria.tipo === 'gastronomica' ? '🍽️ Gastronómica' : '🎨 Artesanal'}
                        </span>
                      </td>
                      <td>
                        <span className="inventario">
                          {productosEnCategoria} productos
                        </span>
                      </td>
                      <td className="actions">
                        <div className="action-buttons">
                          <Link
                            to={`/categorias/editar/${categoria.id_categoria}`}
                            className="btn-action btn-edit"
                            title="Editar"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDeleteCategoria(categoria.id_categoria, categoria.nombre)}
                            className="btn-action btn-delete"
                            title="Eliminar"
                            disabled={productosEnCategoria > 0}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;