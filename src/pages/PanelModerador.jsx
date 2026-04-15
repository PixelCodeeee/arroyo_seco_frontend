import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Palette, Edit, ShieldCheck, Package, Megaphone, Tag } from 'lucide-react';
import { oferentesAPI } from '../services/api';
import Layout from '../components/Layout';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'sonner';
import '../styles/Usuarios.css';

function PanelModerador() {
  const [oferentes, setOferentes] = useState([]);
  const [filteredOferentes, setFilteredOferentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    estado: '',
    tipo: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [confirmEstado, setConfirmEstado] = useState({ isOpen: false, id: null, nuevoEstado: '' });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(userData);
    fetchOferentes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [oferentes, filters]);

  const fetchOferentes = async () => {
    try {
      setLoading(true);
      const response = await oferentesAPI.getAll();
      const data = Array.isArray(response)
        ? response
        : response.oferentes || [];
      setOferentes(data);
      setFilteredOferentes(data);
    } catch (err) {
      setError(err.message || 'Error al cargar oferentes');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...oferentes];
    if (filters.estado) filtered = filtered.filter(o => o.estado === filters.estado);
    if (filters.tipo) filtered = filtered.filter(o => o.tipo === filters.tipo);
    setFilteredOferentes(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ estado: '', tipo: '' });
  };

  const requestEstadoChange = (id, nuevoEstado) => {
    setConfirmEstado({ isOpen: true, id, nuevoEstado });
  };

  const executeEstadoChange = async () => {
    if (!confirmEstado.id) return;
    try {
      await oferentesAPI.updateEstado(confirmEstado.id, { estado: confirmEstado.nuevoEstado });
      toast.success('Estado actualizado exitosamente');
      fetchOferentes();
    } catch (err) {
      toast.error(err.message || 'Error al actualizar estado');
    } finally {
      setConfirmEstado({ isOpen: false, id: null, nuevoEstado: '' });
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'aprobado': return 'badge-success';
      case 'pendiente': return 'badge-warning';
      case 'suspendido': return 'badge-danger';
      default: return 'badge-default';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="usuarios-container">
          <div className="loading">Cargando panel moderador...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="usuarios-container">

        {/* ── Header ── */}
        <header className="usuarios-header">
          <div className="header-content">
            <div>
              <h1>
                <ShieldCheck size={22} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                Panel Moderador
              </h1>
              {currentUser && (
                <p className="welcome-text">
                  Bienvenido, {currentUser.nombre} ({currentUser.rol})
                </p>
              )}
            </div>

            {/* Accesos rápidos del moderador */}
            <div className="header-actions">
              <Link to="/categorias" className="btn btn-secondary">
                <Tag size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Categorías
              </Link>
              <Link to="/anuncios" className="btn btn-secondary">
                <Megaphone size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Anuncios
              </Link>
              <Link to="/productos" className="btn btn-secondary">
                <Package size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Productos
              </Link>
              <Link to="/servicios" className="btn btn-secondary">
                <Utensils size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Servicios
              </Link>
            </div>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        {/* ── Contenido principal ── */}
        {oferentes.length > 0 && (
          <div className="usuarios-content">

            {/* Stats */}
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
            {oferentes.length > 1 && (
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
                    <button onClick={clearFilters} className="btn btn-secondary btn-sm">
                      Limpiar Filtros
                    </button>
                  )}
                </div>
                <div className="results-count">
                  Mostrando {filteredOferentes.length} de {oferentes.length} oferentes
                </div>
              </div>
            )}

            {/* Tabla */}
            <div className="usuarios-table-container table-responsive">
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
                        <td data-label="ID">{oferente.id_oferente}</td>
                        <td data-label="Nombre Negocio">
                          <strong>{oferente.nombre_negocio}</strong>
                        </td>
                        <td data-label="Propietario">
                          {oferente.nombre_usuario}
                          <br />
                          <small>{oferente.correo_usuario}</small>
                        </td>
                        <td data-label="Tipo">
                          <span className={`badge badge-${oferente.tipo}`}>
                            {oferente.tipo === 'restaurante'
                              ? <Utensils size={16} />
                              : <Palette size={16} />
                            } {oferente.tipo}
                          </span>
                        </td>
                        <td data-label="Estado">
                          {/* Moderador SÍ puede cambiar estado */}
                          <select
                            value={oferente.estado}
                            onChange={(e) => requestEstadoChange(oferente.id_oferente, e.target.value)}
                            className={`estado-select ${getEstadoBadgeClass(oferente.estado)}`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="aprobado">Aprobado</option>
                            <option value="suspendido">Suspendido</option>
                          </select>
                        </td>
                        <td data-label="Teléfono">{oferente.telefono || 'N/A'}</td>
                        <td data-label="Dirección">
                          <small>{oferente.direccion || 'N/A'}</small>
                        </td>
                        <td data-label="Acciones" className="actions">
                          {/* Moderador solo puede editar, NO eliminar */}
                          <Link
                            to={`/oferentes/editar/${oferente.id_oferente}`}
                            className="btn-action btn-edit"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {oferentes.length === 0 && !loading && (
          <div className="usuarios-content">
            <div className="alert alert-info">
              No hay oferentes registrados aún.
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmEstado.isOpen}
        title="Cambiar Estado"
        message={`¿Estás seguro de que deseas cambiar el estado a "${confirmEstado.nuevoEstado}"?`}
        onConfirm={executeEstadoChange}
        onClose={() => setConfirmEstado({ isOpen: false, id: null, nuevoEstado: '' })}
        confirmText="Cambiar estado"
        isDestructive={false}
      />
    </Layout>
  );
}

export default PanelModerador;