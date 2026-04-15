import { Clock, CheckCircle, XCircle, CreditCard, Utensils, Palette, Info, Trash2, Edit } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { oferentesAPI } from '../services/api';
import Layout from '../components/Layout';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'sonner';
import '../styles/Usuarios.css';
import { mercadopagoAPI } from '../services/api';

function Oferentes() {
  const [oferentes, setOferentes] = useState([]);
  const [filteredOferentes, setFilteredOferentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ estado: '', tipo: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [isOferente, setIsOferente] = useState(false);
  const [isModerador, setIsModerador] = useState(false);
  const [hasOferenteProfile, setHasOferenteProfile] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [confirmEstado, setConfirmEstado] = useState({ isOpen: false, id: null, nuevoEstado: '' });

  // ── MercadoPago states ──────────────────────────────────────────────
  const [mpEstado, setMpEstado] = useState(null);
  const [mpLoading, setMpLoading] = useState(false);
  const [mpMensaje, setMpMensaje] = useState('');

  useEffect(() => {
    initializeComponent();
    checkMpQueryParams();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [oferentes, filters]);

  const checkMpQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const mpStatus = params.get('mp_status');
    const mpError = params.get('mp_error');

    if (mpStatus === 'conectado') {
      setMpMensaje('¡Cuenta de MercadoPago conectada exitosamente!');
      fetchMpEstado();
    } else if (mpError) {
      setMpMensaje(`Error al conectar con MercadoPago: ${mpError.replace(/_/g, ' ')}`);
    }

    if (mpStatus || mpError) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const initializeComponent = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setCurrentUser(userData);

      if (userData?.rol === 'oferente') {
        setIsOferente(true);
        await fetchOferentesByUser(userData.id_usuario);
        await fetchMpEstado();
      } else if (userData?.rol === 'moderador') {
        // Moderador ve todos los oferentes pero no puede crear ni eliminar
        setIsModerador(true);
        await fetchOferentes();
      } else {
        await fetchOferentes();
      }
    } catch (err) {
      setError('Error al inicializar el componente');
      console.error('Init error:', err);
    }
  };

  const fetchMpEstado = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const data = await mercadopagoAPI.getEstado();
      if (data.ok) setMpEstado(data.mp_estado);
    } catch (err) {
      console.log('MP estado no disponible:', err.message);
    }
  };

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

  const fetchOferentesByUser = async (userId) => {
    try {
      setLoading(true);
      const oferente = await oferentesAPI.getByUserId(userId);
      if (oferente) {
        setHasOferenteProfile(true);
        setOferentes([oferente]);
        setFilteredOferentes([oferente]);
      } else {
        setHasOferenteProfile(false);
        setOferentes([]);
        setFilteredOferentes([]);
      }
    } catch (err) {
      setHasOferenteProfile(false);
      setOferentes([]);
      setFilteredOferentes([]);
      if (err.message && !err.message.includes('404')) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connectMercadoPago = async () => {
    try {
      setMpLoading(true);
      setMpMensaje('');
      const data = await mercadopagoAPI.getOAuthUrl();
      if (data.ok && data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        setMpMensaje('No se pudo obtener la URL de autorización');
      }
    } catch (err) {
      setMpMensaje(`Error: ${err.message}`);
    } finally {
      setMpLoading(false);
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

  const clearFilters = () => setFilters({ estado: '', tipo: '' });

  const requestEstadoChange = (id, nuevoEstado) => {
    if (isOferente) {
      toast.error('No tienes permiso para cambiar el estado');
      return;
    }
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

  const requestDelete = (id) => {
    if (isOferente || isModerador) {
      toast.error('No tienes permiso para eliminar oferentes');
      return;
    }
    setConfirmDelete({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await oferentesAPI.delete(confirmDelete.id);
      toast.success('Oferente eliminado exitosamente');
      fetchOferentes();
    } catch (err) {
      toast.error(err.message || 'Error al eliminar oferente');
    } finally {
      setConfirmDelete({ isOpen: false, id: null });
    }
  };

  const canEditOferente = (oferente) => {
    if (!isOferente) return true; // admin y moderador pueden editar cualquiera
    return oferente.id_usuario === currentUser?.id_usuario;
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'aprobado': return 'badge-success';
      case 'pendiente': return 'badge-warning';
      case 'suspendido': return 'badge-danger';
      default: return 'badge-default';
    }
  };

  const getMpBadge = () => {
    if (!mpEstado) return null;
    const config = {
      activo: { clase: 'badge-success', texto: <><CheckCircle size={16} /> MercadoPago Conectado</> },
      pendiente: { clase: 'badge-warning', texto: <><Clock size={16} /> MercadoPago Pendiente</> },
      rechazado: { clase: 'badge-danger', texto: <><XCircle size={16} /> MercadoPago Rechazado</> },
    };
    const c = config[mpEstado] || config.pendiente;
    return <span className={`badge ${c.clase}`}>{c.texto}</span>;
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
              <h1>
                {isOferente ? 'Mi Perfil de Oferente' : 'Gestión de Oferentes'}
              </h1>
              {currentUser && (
                <p className="welcome-text">
                  Bienvenido, {currentUser.nombre} ({currentUser.rol})
                </p>
              )}
            </div>
            <div className="header-actions">
              {/* Crear solo si NO es moderador y NO es oferente con perfil ya */}
              {!isModerador && (!isOferente || !hasOferenteProfile) && (
                <Link to="/oferentes/crear" className="btn btn-primary">
                  + {isOferente ? 'Crear Negocio' : 'Nuevo Oferente'}
                </Link>
              )}

              {/* MercadoPago solo para oferentes con perfil */}
              {isOferente && hasOferenteProfile && (
                <button
                  onClick={connectMercadoPago}
                  disabled={mpLoading || mpEstado === 'activo'}
                  className="btn btn-success"
                  style={{ marginLeft: '10px' }}
                  title={mpEstado === 'activo' ? 'Tu cuenta ya está conectada' : 'Conecta tu cuenta de MercadoPago para recibir pagos'}
                >
                  {mpLoading
                    ? <><Clock size={16} /> Conectando...</>
                    : mpEstado === 'activo'
                      ? <><CheckCircle size={16} /> MP Conectado</>
                      : <><CreditCard size={16} /> Conectar MercadoPago</>}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Mensaje resultado OAuth MP */}
        {mpMensaje && (
          <div className={`alert ${mpMensaje.includes('exitosamente') ? 'alert-success' : 'alert-danger'}`}
            style={{ margin: '0 0 16px 0' }}>
            {mpMensaje}
          </div>
        )}

        {/* Badge estado MP */}
        {isOferente && hasOferenteProfile && mpEstado && (
          <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            {getMpBadge()}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {/* Sin perfil de oferente */}
        {isOferente && !hasOferenteProfile && (
          <div className="usuarios-content">
            <div className="alert alert-info">
              <span className="alert-icon"><Info size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></span>
              <div>
                <strong>No tienes un negocio como oferente</strong>
                <p>Crea tu negocio para empezar a ofrecer tus servicios o productos.</p>
                <Link to="/oferentes/crear" className="btn btn-primary" style={{ marginTop: '10px' }}>
                  Crear Mi Negocio
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tabla */}
        {oferentes.length > 0 && (
          <div className="usuarios-content">
            {(!isOferente || hasOferenteProfile) && (
              <div className="usuarios-stats">
                <div className="stat-card">
                  <div className="stat-value">{oferentes.length}</div>
                  <div className="stat-label">{isOferente ? 'Mi Perfil' : 'Total Oferentes'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{oferentes.filter(o => o.estado === 'aprobado').length}</div>
                  <div className="stat-label">Aprobados</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{oferentes.filter(o => o.estado === 'pendiente').length}</div>
                  <div className="stat-label">Pendientes</div>
                </div>
                {!isOferente && (
                  <>
                    <div className="stat-card">
                      <div className="stat-value">{oferentes.filter(o => o.tipo === 'restaurante').length}</div>
                      <div className="stat-label">Restaurantes</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{oferentes.filter(o => o.tipo === 'artesanal').length}</div>
                      <div className="stat-label">Artesanales</div>
                    </div>
                  </>
                )}
              </div>
            )}

            {!isOferente && oferentes.length > 1 && (
              <div className="filters-section">
                <div className="filters-row">
                  <div className="filter-group">
                    <label htmlFor="filter-estado">Estado:</label>
                    <select id="filter-estado" name="estado" value={filters.estado} onChange={handleFilterChange}>
                      <option value="">Todos</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="suspendido">Suspendido</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label htmlFor="filter-tipo">Tipo:</label>
                    <select id="filter-tipo" name="tipo" value={filters.tipo} onChange={handleFilterChange}>
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

            <div className="usuarios-table-container table-responsive">
              <table className="usuarios-table">
                <thead>
                  <tr>

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

                        <td data-label="Nombre Negocio">
                          <strong>{oferente.nombre_negocio}</strong>
                        </td>
                        {!isOferente && (
                          <td data-label="Propietario">
                            {oferente.nombre_usuario}<br />
                            <small>{oferente.correo_usuario}</small>
                          </td>
                        )}
                        <td data-label="Tipo">
                          <span className={`badge badge-${oferente.tipo}`}>
                            {oferente.tipo === 'restaurante' ? <Utensils size={16} /> : <Palette size={16} />} {oferente.tipo}
                          </span>
                        </td>
                        <td data-label="Estado">
                          {/* Admin y moderador pueden cambiar estado, oferente solo ve */}
                          {!isOferente ? (
                            <select
                              value={oferente.estado}
                              onChange={(e) => requestEstadoChange(oferente.id_oferente, e.target.value)}
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
                        <td data-label="Teléfono">{oferente.telefono || 'N/A'}</td>
                        <td data-label="Dirección"><small>{oferente.direccion || 'N/A'}</small></td>
                        <td data-label="Acciones" className="actions">
                          {canEditOferente(oferente) ? (
                            <>
                              <Link
                                to={`/oferentes/editar/${oferente.id_oferente}`}
                                className="btn-action btn-edit"
                                title="Editar"
                              >
                                <Edit size={18} />
                              </Link>
                              {/* Eliminar solo para admin, NO moderador */}
                              {!isOferente && !isModerador && (
                                <button
                                  onClick={() => requestDelete(oferente.id_oferente)}
                                  className="btn-action btn-delete"
                                  title="Eliminar"
                                >
                                  <Trash2 size={18} />
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

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Eliminar Oferente"
        message="¿Estás seguro de que deseas eliminar este oferente? Esta acción no se puede deshacer."
        onConfirm={executeDelete}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        confirmText="Eliminar"
      />

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

export default Oferentes;