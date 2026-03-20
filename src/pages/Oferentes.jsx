import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { oferentesAPI } from '../services/api';
import Layout from '../components/Layout';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isOferente, setIsOferente] = useState(false);
  const [hasOferenteProfile, setHasOferenteProfile] = useState(false);

  useEffect(() => {
    initializeComponent();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [oferentes, filters]);

  const initializeComponent = async () => {
    try {
      // Get current user from localStorage
      const userData = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setCurrentUser(userData);
      
      if (userData && userData.rol === 'oferente') {
        setIsOferente(true);
        // Fetch only this user's oferente profile
        await fetchOferentesByUser(userData.id_usuario);
      } else {
        // Admin or other roles - fetch all oferentes
        await fetchOferentes();
      }
    } catch (err) {
      setError('Error al inicializar el componente');
      console.error('Init error:', err);
    }
  };

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

  const fetchOferentesByUser = async (userId) => {
    try {
      setLoading(true);
      const oferente = await oferentesAPI.getByUserId(userId);
      
      if (oferente) {
        // User has an oferente profile
        setHasOferenteProfile(true);
        setOferentes([oferente]);
        setFilteredOferentes([oferente]);
      } else {
        // User doesn't have an oferente profile yet
        setHasOferenteProfile(false);
        setOferentes([]);
        setFilteredOferentes([]);
      }
    } catch (err) {
      // Error likely means no oferente found for this user
      setHasOferenteProfile(false);
      setOferentes([]);
      setFilteredOferentes([]);
      
      if (err.message && !err.message.includes('404')) {
        setError(err.message);
      }
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
    // Only admins can change estado
    if (isOferente) {
      alert('No tienes permiso para cambiar el estado');
      return;
    }

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
    // Only admins can delete
    if (isOferente) {
      alert('No tienes permiso para eliminar oferentes');
      return;
    }

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

  const canEditOferente = (oferente) => {
    // Admins can edit any oferente
    if (!isOferente) return true;
    
    // Oferentes can only edit their own
    return oferente.id_usuario === currentUser?.id_usuario;
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
      <Layout>
        <div className="usuarios-container">
          <div className="loading">Cargando oferentes...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="usuarios-container">
        <header className="usuarios-header">
          <div className="header-content">
            <div>
              <h1>{isOferente ? 'Mi Perfil de Oferente' : 'Gestión de Oferentes'}</h1>
              {currentUser && (
                <p className="welcome-text">
                  Bienvenido, {currentUser.nombre} ({currentUser.rol})
                </p>
              )}
            </div>
            <div className="header-actions">
              {/* Show "Nuevo Oferente" button only if: */}
              {/* 1. User is admin (can create for anyone), OR */}
              {/* 2. User is oferente AND doesn't have a profile yet */}
              {(!isOferente || !hasOferenteProfile) && (
                <Link to="/oferentes/crear" className="btn btn-primary">
                  + {isOferente ? 'Crear Mi Perfil' : 'Nuevo Oferente'}
                </Link>
              )}
            </div>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        {/* Show message if oferente user has no profile */}
        {isOferente && !hasOferenteProfile && (
          <div className="usuarios-content">
            <div className="alert alert-info">
              <span className="alert-icon">ℹ️</span>
              <div>
                <strong>No tienes un perfil de oferente</strong>
                <p>Crea tu perfil para empezar a ofrecer tus servicios o productos.</p>
                <Link to="/oferentes/crear" className="btn btn-primary" style={{ marginTop: '10px' }}>
                  Crear Mi Perfil de Oferente
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Show content only if there are oferentes to display */}
        {(oferentes.length > 0) && (
          <div className="usuarios-content">
            {/* Estadísticas - Only show for admins or if oferente has profile */}
            {(!isOferente || hasOferenteProfile) && (
              <div className="usuarios-stats">
                <div className="stat-card">
                  <div className="stat-value">{oferentes.length}</div>
                  <div className="stat-label">{isOferente ? 'Mi Perfil' : 'Total Oferentes'}</div>
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
                {!isOferente && (
                  <>
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
                  </>
                )}
              </div>
            )}

            {/* Filtros - Only show for admins when there are multiple oferentes */}
            {!isOferente && oferentes.length > 1 && (
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
            )}

            {/* Tabla de oferentes */}
            <div className="usuarios-table-container">
              <table className="usuarios-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre Negocio</th>
                    {!isOferente && <th>Propietario</th>}
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
                      <td colSpan={isOferente ? "7" : "8"} className="text-center">
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
                        {!isOferente && (
                          <td>
                            {oferente.nombre_usuario}
                            <br />
                            <small>{oferente.correo_usuario}</small>
                          </td>
                        )}
                        <td>
                          <span className={`badge badge-${oferente.tipo}`}>
                            {oferente.tipo === 'restaurante' ? '🍽️' : '🎨'} {oferente.tipo}
                          </span>
                        </td>
                        <td>
                          {!isOferente ? (
                            <select
                              value={oferente.estado}
                              onChange={(e) => handleEstadoChange(oferente.id_oferente, e.target.value)}
                              className={`estado-select ${getEstadoBadgeClass(oferente.estado)}`}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="aprobado">Aprobado</option>
                              <option value="suspendido">Suspendido</option>
                            </select>
                          ) : (
                            <span className={`badge ${getEstadoBadgeClass(oferente.estado)}`}>
                              {oferente.estado}
                            </span>
                          )}
                        </td>
                        <td>{oferente.telefono || 'N/A'}</td>
                        <td>
                          <small>{oferente.direccion || 'N/A'}</small>
                        </td>
                        <td className="actions">
                          {canEditOferente(oferente) ? (
                            <>
                              <Link
                                to={`/oferentes/editar/${oferente.id_oferente}`}
                                className="btn-action btn-edit"
                                title="Editar"
                              >
                                ✏️
                              </Link>
                              {!isOferente && (
                                <button
                                  onClick={() => handleDelete(oferente.id_oferente)}
                                  className="btn-action btn-delete"
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Oferentes;