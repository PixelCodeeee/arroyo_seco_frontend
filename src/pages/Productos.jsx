// src/components/Productos.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productosAPI } from "../services/api";
import Layout from "../components/Layout";
import "../styles/Usuarios.css";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategoria, setFilterCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAdmin = user?.rol === "admin";
  const isOferente = user?.rol === "oferente";

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const res = await productosAPI.getAll();

      let data = res.productos;

      if (isOferente && user?.oferenteId) {
        data = data.filter((p) => p.id_oferente === user.oferenteId);
      }

      setProductos(data);
      setFiltered(data);
      setCategorias(res.categorias);
    } catch (err) {
      setError(err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...productos];
    if (filterCategoria) {
      data = data.filter((p) => p.id_categoria === parseInt(filterCategoria));
    }
    setFiltered(data);
  };

  useEffect(applyFilters, [filterCategoria, productos]);

  const clearFilters = () => setFilterCategoria("");

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await productosAPI.delete(id);
      loadProductos();
    } catch (err) {
      alert(err.message || "Error al eliminar");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="usuarios-container">
          <div className="loading">Cargando productos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="usuarios-container">

        {/* HEADER */}
        <header className="usuarios-header">
          <div className="header-content">
            <div>
              <h1>Productos</h1>
              <p className="welcome-text">
                {isOferente ? "Mis productos" : "Gestión de productos"}
              </p>
            </div>

            <div className="header-actions">
              {(isAdmin || isOferente) && (
                <Link to="/productos/crear" className="btn btn-primary">
                  + Nuevo Producto
                </Link>
              )}
            </div>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        {/* STATS */}
        <div className="usuarios-stats">
          <div className="stat-card">
            <div className="stat-value">{productos.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {productos.filter((p) => p.estatus === 1).length}
            </div>
            <div className="stat-label">Activos</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label>Categoría:</label>
              <select
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
              >
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            {filterCategoria && (
              <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                Limpiar
              </button>
            )}
          </div>

          <div className="results-count">
            Mostrando {filtered.length} de {productos.length}
          </div>
        </div>

        {/* TABLE */}
        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Inventario</th>
                <th>Imágenes</th>
                <th>Estatus</th>
                {isAdmin && <th>Oferente</th>}
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9">No hay productos</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id_producto}>
                    <td>{p.id_producto}</td>

                    <td>
                      <strong>{p.nombre}</strong>
                    </td>

                    <td>
                      {categorias.find((c) => c.id_categoria === p.id_categoria)?.nombre ||
                        "N/A"}
                    </td>

                    <td>${p.precio}</td>
                    <td>{p.inventario}</td>

                    <td>{Array.isArray(p.imagenes) ? p.imagenes.length : 0}</td>

                    <td>
                      <span className={`badge ${p.estatus ? "badge-success" : "badge-danger"}`}>
                        {p.estatus ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    {isAdmin && <td>{p.id_oferente}</td>}

                    <td className="actions">
                      <Link to={`/productos/editar/${p.id_producto}`} className="btn-action btn-edit">
                        ✏️
                      </Link>

                      <button onClick={() => handleDelete(p.id_producto)} className="btn-action btn-delete">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </Layout>
  );
}

export default Productos;
