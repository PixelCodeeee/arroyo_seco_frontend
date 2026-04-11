import { Clock, CheckCircle, Truck, XCircle, CreditCard, Utensils, Palette, Trash2, Edit } from 'lucide-react';
// src/components/Categorias.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productosAPI } from "../services/api";
import Layout from "../components/Layout";
import "../styles/Usuarios.css";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterTipo, setFilterTipo] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAdmin = currentUser?.rol === "admin";

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [categorias, filterTipo]);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const res = await productosAPI.getCategorias();
      setCategorias(res.categorias);
      setFiltered(res.categorias);
    } catch (err) {
      setError(err.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...categorias];
    if (filterTipo) data = data.filter((c) => c.tipo === filterTipo);
    setFiltered(data);
  };

  const clearFilters = () => setFilterTipo("");

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("No tienes permiso");
    if (!window.confirm("¿Eliminar categoría?")) return;

    try {
      await productosAPI.eliminarCategoria(id);
      alert("Categoría eliminada");
      loadCategorias();
    } catch (err) {
      alert(err.message || "Error al eliminar");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="usuarios-container">
          <div className="loading">Cargando categorías...</div>
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
              <h1>Categorías de Productos</h1>
              <p className="welcome-text">Gestión de categorías gastronómicas y artesanales</p>
            </div>
            <div className="header-actions">
              {isAdmin && (
                <Link to="/categorias/crear" className="btn btn-primary">
                  + Nueva Categoría
                </Link>
              )}
            </div>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        {/* STATS */}
        <div className="usuarios-stats">
          <div className="stat-card">
            <div className="stat-value">{categorias.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {categorias.filter((c) => c.tipo === "gastronomica").length}
            </div>
            <div className="stat-label">Gastronómicas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {categorias.filter((c) => c.tipo === "artesanal").length}
            </div>
            <div className="stat-label">Artesanales</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label>Tipo:</label>
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="gastronomica">Gastronómica</option>
                <option value="artesanal">Artesanal</option>
              </select>
            </div>

            {filterTipo && (
              <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                Limpiar Filtros
              </button>
            )}
          </div>

          <div className="results-count">
            Mostrando {filtered.length} de {categorias.length}
          </div>
        </div>

        {/* TABLE */}
        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                {isAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4">No hay categorías</td>
                </tr>
              ) : (
                filtered.map((cat) => (
                  <tr key={cat.id_categoria}>
                    <td>{cat.id_categoria}</td>
                    <td><strong>{cat.nombre}</strong></td>
                    <td>
                      <span className={`badge badge-${cat.tipo}`}>
                        {cat.tipo === 'gastronomica' ? <><Utensils size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />️ Gastronómica</> : <><Palette size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Artesanal</>}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="actions">
                        <Link
                          to={`/categorias/editar/${cat.id_categoria}`}
                          className="btn-action btn-edit"
                          title="Editar"
                        >
                          <Edit size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />️
                        </Link>

                        <button
                          onClick={() => handleDelete(cat.id_categoria)}
                          className="btn-action btn-delete"
                          title="Eliminar"
                        >
                          <Trash2 size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />️
                        </button>
                      </td>
                    )}
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

export default Categorias;