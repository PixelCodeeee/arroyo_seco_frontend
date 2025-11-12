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
  const [filtro, setFiltro] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [showCategorias, setShowCategorias] = useState(false);
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productosRes, categoriasRes] = await Promise.all([
        productosAPI.getAll(),
        categoriasAPI.getAll()
      ]);
      setProductos(productosRes.productos || []);
      setCategorias(categoriasRes.categorias || []);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProducto = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) {
      return;
    }

    try {
      await productosAPI.delete(id);
      alert('✅ Producto eliminado exitosamente');
      fetchData();
    } catch (err) {
      alert(err.message || 'Error al eliminar producto');
    }
  };

  const handleDeleteCategoria = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) {
      return;
    }

    try {
      await categoriasAPI.delete(id);
      alert('✅ Categoría eliminada exitosamente');
      fetchData();
    } catch (err) {
      alert(err.message || 'Error al eliminar categoría');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const productosFiltrados = productos.filter(producto => {
    const matchFiltro = filtro === 'todos' || 
      (filtro === 'disponible' && producto.esta_disponible) ||
      (filtro === 'agotado' && producto.inventario === 0);
    
    const matchCategoria = filtroCategoria === 'todas' || 
      producto.id_categoria == filtroCategoria;
    
    const matchBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.nombre_negocio?.toLowerCase().includes(busqueda.toLowerCase());
    
    return matchFiltro && matchCategoria && matchBusqueda;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="productos-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="productos-container">
      <header className="productos-header">
        <div className="header-content">
          <div className="header-info">
            <h1>🛍️ Gestión de Productos y Categorías</h1>
            {currentUser && (
              <p className="welcome-text">
                Bienvenido, {currentUser.nombre} ({currentUser.rol})
              </p>
            )}
          </div>
          <div className="header-actions">
            <Link to="/productos/crear" className="btn btn-primary">
              + Nuevo Producto
            </Link>
            <button 
              onClick={() => setShowCategorias(!showCategorias)} 
              className={`btn ${showCategorias ? 'btn-primary' : 'btn-outline'}`}
            >
              {showCategorias ? '📦 Ver Productos' : '🏷️ Ver Categorías'}
            </button>
            <Link to="/oferentes" className="btn btn-outline">
              Ver Oferentes
            </Link>
            <Link to="/usuarios" className="btn btn-outline">
              Ver Usuarios
            </Link>
            <button onClick={handleLogout} className="btn btn-outline">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!showCategorias ? (
        // Vista de Productos
        <div className="productos-content">
          {/* Estadísticas */}
          <div className="productos-stats">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-value">{productos.length}</div>
              <div className="stat-label">Total Productos</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">
                {productos.filter(p => p.esta_disponible).length}
              </div>
              <div className="stat-label">Disponibles</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🍽️</div>
              <div className="stat-value">
                {productos.filter(p => p.categoria_tipo === 'gastronomica').length}
              </div>
              <div className="stat-label">Gastronómicos</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎨</div>
              <div className="stat-value">
                {productos.filter(p => p.categoria_tipo === 'artesanal').length}
              </div>
              <div className="stat-label">Artesanales</div>
            </div>
          </div>

          {/* Controles de filtrado */}
          <div className="productos-controls">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar por nombre o negocio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select 
              value={filtroCategoria} 
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="filter-select"
            >
              <option value="todas">Todas las categorías</option>
              <optgroup label="Gastronómicas">
                {categorias.filter(c => c.tipo === 'gastronomica').map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Artesanales">
                {categorias.filter(c => c.tipo === 'artesanal').map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </optgroup>
            </select>
            
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filtro === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltro('todos')}
              >
                Todos
              </button>
              <button
                className={`filter-btn ${filtro === 'disponible' ? 'active' : ''}`}
                onClick={() => setFiltro('disponible')}
              >
                Disponibles
              </button>
              <button
                className={`filter-btn ${filtro === 'agotado' ? 'active' : ''}`}
                onClick={() => setFiltro('agotado')}
              >
                Agotados
              </button>
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="productos-table-container">
            {productosFiltrados.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>No se encontraron productos</p>
              </div>
            ) : (
              <table className="productos-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Inventario</th>
                    <th>Oferente</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id_producto}>
                      <td>{producto.id_producto}</td>
                      <td>
                        <div className="producto-imagen">
                          {producto.imagenes && producto.imagenes.length > 0 ? (
                            <img src={producto.imagenes[0]} alt={producto.nombre} />
                          ) : (
                            <div className="no-imagen">📷</div>
                          )}
                        </div>
                      </td>
                      <td className="producto-nombre">
                        <strong>{producto.nombre}</strong>
                        {producto.descripcion && (
                          <small>{producto.descripcion.substring(0, 50)}...</small>
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${producto.categoria_tipo}`}>
                          {producto.categoria_nombre || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="precio">{formatPrice(producto.precio)}</td>
                      <td>
                        <span className={`inventario ${producto.inventario === 0 ? 'agotado' : ''}`}>
                          {producto.inventario} uds
                        </span>
                      </td>
                      <td>{producto.nombre_negocio}</td>
                      <td>
                        {producto.esta_disponible ? (
                          <span className="estado disponible">✓ Disponible</span>
                        ) : (
                          <span className="estado no-disponible">✗ No disponible</span>
                        )}
                      </td>
                      <td className="actions">
                        <div className="action-buttons">
                          <Link
                            to={`/productos/editar/${producto.id_producto}`}
                            className="btn-action btn-edit"
                            title="Editar"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDeleteProducto(producto.id_producto, producto.nombre)}
                            className="btn-action btn-delete"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
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