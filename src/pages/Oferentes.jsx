import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { oferentesAPI } from '../services/api';
import '../styles/Usuarios.css';

function Oferentes() {
  const navigate = useNavigate();
  const [oferentes, setOferentes] = useState([]);
  const [filteredOferentes, setFilteredOferentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    estado: '',
    tipo: ''
  });
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    fetchOferentes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [oferentes, filters]);

  const fetchOferentes = async () => {
    try {
      setLoading(true);
      const response = await oferentesAPI.getAll();
      setOferentes(response.oferentes);
      setFilteredOferentes(response.oferentes);
    } catch (err) {
      setError(err.message || 'Error al cargar oferentes');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...oferentes];

    if (filters.estado) {
      filtered = filtered.filter(o => o.estado === filters.estado);
    }

    if (filters.tipo) {
      filtered = filtered.filter(o => o.tipo === filters.tipo);
    }

    setFilteredOferentes(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      estado: '',
      tipo: ''
    });
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    if (!window.confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) {
      return;
    }

    try {
      await oferentesAPI.updateEstado(id, { estado: nuevoEstado });
      alert('Estado actualizado exitosamente');
      fetchOferentes();
    } catch (err) {
      alert(err.message || 'Error al actualizar estado');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este oferente?')) {
      return;
    }

    try {
      await oferentesAPI.delete(id);
      alert('Oferente eliminado exitosamente');
      fetchOferentes();
    } catch (err) {
      alert(err.message || 'Error al eliminar oferente');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const getEstadoBadgeClass = (estado) => {
    switch(estado) {
      case 'aprobado': return 'badge-success';
      case 'pendiente': return 'badge-warning';
      case 'suspendido': return 'badge-danger';
      default: return 'badge-default';
    }
  };

  if (loading) {
    return (
      <div className="usuarios-container">
        <div className="loading">Cargando oferentes...</div>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      <header className="usuarios-header">
        <div className="header-content">
          <div>
            <h1>Gestión de Oferentes</h1>
            {currentUser && (
              <p className="welcome-text">
                Bienvenido, {currentUser.nombre} ({currentUser.rol})
              </p>
            )}
          </div>
          <div className="header-actions">
            <Link to="/oferentes/crear" className="btn btn-primary">
              + Nuevo Oferente
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

      {error && <div className="error-message">{error}</div>}

      <div className="usuarios-content">
        {/* Estadísticas */}
        <div className="usuarios-stats">
          <div className="stat-card">
            <div className="stat-value">{oferentes.length}</div>
            <div className="stat-label">Total Oferentes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {oferentes.filter(o => o.estado === 'aprobado').length}
            </div>
            <div className="stat-label">Aprobados</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {oferentes.filter(o => o.estado === 'pendiente').length}
            </div>
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {oferentes.filter(o => o.tipo === 'restaurante').length}
            </div>
            <div className="stat-label">Restaurantes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {oferentes.filter(o => o.tipo === 'artesanal').length}
            </div>
            <div className="stat-label">Artesanales</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="filter-estado">Estado:</label>
              <select
                id="filter-estado"
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="suspendido">Suspendido</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-tipo">Tipo:</label>
              <select
                id="filter-tipo"
                name="tipo"
                value={filters.tipo}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="restaurante">Restaurante</option>
                <option value="artesanal">Artesanal</option>
              </select>
            </div>

            {(filters.estado || filters.tipo) && (
              <button 
                onClick={clearFilters}
                className="btn btn-secondary btn-sm"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
          <div className="results-count">
            Mostrando {filteredOferentes.length} de {oferentes.length} oferentes
          </div>
        </div>

        {/* Tabla de oferentes */}
        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Negocio</th>
                <th>Propietario</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOferentes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No se encontraron oferentes
                  </td>
                </tr>
              ) : (
                filteredOferentes.map((oferente) => (
                  <tr key={oferente.id_oferente}>
                    <td>{oferente.id_oferente}</td>
                    <td>
                      <strong>{oferente.nombre_negocio}</strong>
                    </td>
                    <td>
                      {oferente.nombre_usuario}
                      <br />
                      <small>{oferente.correo_usuario}</small>
                    </td>
                    <td>
                      <span className={`badge badge-${oferente.tipo}`}>
                        {oferente.tipo === 'restaurante' ? '🍽️' : '🎨'} {oferente.tipo}
                      </span>
                    </td>
                    <td>
                      <select
                        value={oferente.estado}
                        onChange={(e) => handleEstadoChange(oferente.id_oferente, e.target.value)}
                        className={`estado-select ${getEstadoBadgeClass(oferente.estado)}`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="suspendido">Suspendido</option>
                      </select>
                    </td>
                    <td>{oferente.telefono || 'N/A'}</td>
                    <td>
                      <small>{oferente.direccion || 'N/A'}</small>
                    </td>
                    <td className="actions">
                      <Link
                        to={`/oferentes/editar/${oferente.id_oferente}`}
                        className="btn-action btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(oferente.id_oferente)}
                        className="btn-action btn-delete"
                        title="Eliminar"
                      >
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
    </div>
  );
}

export default Oferentes;