// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { oferentesAPI } from '../services/api';
// import Layout from '../components/Layout';
// import '../styles/Usuarios.css';

// function Oferentes() {
//   const navigate = useNavigate();
//   const [oferentes, setOferentes] = useState([]);
//   const [filteredOferentes, setFilteredOferentes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     estado: '',
//     tipo: ''
//   });
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isOferente, setIsOferente] = useState(false);
//   const [hasOferenteProfile, setHasOferenteProfile] = useState(false);

//   useEffect(() => {
//     initializeComponent();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [oferentes, filters]);

//   const initializeComponent = async () => {
//     try {
//       // Get current user from localStorage
//       const userData = JSON.parse(localStorage.getItem('currentUser') || 'null');
//       setCurrentUser(userData);
      
//       if (userData && userData.rol === 'oferente') {
//         setIsOferente(true);
//         // Fetch only this user's oferente profile
//         await fetchOferentesByUser(userData.id_usuario);
//       } else {
//         // Admin or other roles - fetch all oferentes
//         await fetchOferentes();
//       }
//     } catch (err) {
//       setError('Error al inicializar el componente');
//       console.error('Init error:', err);
//     }
//   };

//   const fetchOferentes = async () => {
//     try {
//       setLoading(true);
//       const response = await oferentesAPI.getAll();
//       setOferentes(response.oferentes);
//       setFilteredOferentes(response.oferentes);
//     } catch (err) {
//       setError(err.message || 'Error al cargar oferentes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOferentesByUser = async (userId) => {
//     try {
//       setLoading(true);
//       const oferente = await oferentesAPI.getByUserId(userId);
      
//       if (oferente) {
//         // User has an oferente profile
//         setHasOferenteProfile(true);
//         setOferentes([oferente]);
//         setFilteredOferentes([oferente]);
//       } else {
//         // User doesn't have an oferente profile yet
//         setHasOferenteProfile(false);
//         setOferentes([]);
//         setFilteredOferentes([]);
//       }
//     } catch (err) {
//       // Error likely means no oferente found for this user
//       setHasOferenteProfile(false);
//       setOferentes([]);
//       setFilteredOferentes([]);
      
//       if (err.message && !err.message.includes('404')) {
//         setError(err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...oferentes];

//     if (filters.estado) {
//       filtered = filtered.filter(o => o.estado === filters.estado);
//     }

//     if (filters.tipo) {
//       filtered = filtered.filter(o => o.tipo === filters.tipo);
//     }

//     setFilteredOferentes(filtered);
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       estado: '',
//       tipo: ''
//     });
//   };

//   const handleEstadoChange = async (id, nuevoEstado) => {
//     // Only admins can change estado
//     if (isOferente) {
//       alert('No tienes permiso para cambiar el estado');
//       return;
//     }

//     if (!window.confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) {
//       return;
//     }

//     try {
//       await oferentesAPI.updateEstado(id, { estado: nuevoEstado });
//       alert('Estado actualizado exitosamente');
//       fetchOferentes();
//     } catch (err) {
//       alert(err.message || 'Error al actualizar estado');
//     }
//   };

// //mercado pago----
// const connectMercadoPago = async () => {
//   const response = await fetch("http://localhost:5005/api/payments/connect");
//   const data = await response.json();
//   window.location.href = data.url;
// };



//   const handleDelete = async (id) => {
//     // Only admins can delete
//     if (isOferente) {
//       alert('No tienes permiso para eliminar oferentes');
//       return;
//     }

//     if (!window.confirm('¿Estás seguro de eliminar este oferente?')) {
//       return;
//     }

//     try {
//       await oferentesAPI.delete(id);
//       alert('Oferente eliminado exitosamente');
//       fetchOferentes();
//     } catch (err) {
//       alert(err.message || 'Error al eliminar oferente');
//     }
//   };

//   const canEditOferente = (oferente) => {
//     // Admins can edit any oferente
//     if (!isOferente) return true;
    
//     // Oferentes can only edit their own
//     return oferente.id_usuario === currentUser?.id_usuario;
//   };

//   const getEstadoBadgeClass = (estado) => {
//     switch(estado) {
//       case 'aprobado': return 'badge-success';
//       case 'pendiente': return 'badge-warning';
//       case 'suspendido': return 'badge-danger';
//       default: return 'badge-default';
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="usuarios-container">
//           <div className="loading">Cargando oferentes...</div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="usuarios-container">
//         <header className="usuarios-header">
//           <div className="header-content">
//             <div>
//               <h1>{isOferente ? 'Mi Perfil de Oferente' : 'Gestión de Oferentes'}</h1>
//               {currentUser && (
//                 <p className="welcome-text">
//                   Bienvenido, {currentUser.nombre} ({currentUser.rol})
//                 </p>
//               )}
//             </div>
//             <div className="header-actions">
//               {/* Show "Nuevo Oferente" button only if: */}
//               {/* 1. User is admin (can create for anyone), OR */}
//               {/* 2. User is oferente AND doesn't have a profile yet */}
//               {(!isOferente || !hasOferenteProfile) && (
//                 <Link to="/oferentes/crear" className="btn btn-primary">
//                   + {isOferente ? 'Crear Mi Perfil' : 'Nuevo Oferente'}
//                 </Link>
//               )}
//             </div>
//           </div>
//         </header>

//         {error && <div className="error-message">{error}</div>}

//         {/* Show message if oferente user has no profile */}
//         {isOferente && !hasOferenteProfile && (
//           <div className="usuarios-content">
//             <div className="alert alert-info">
//               <span className="alert-icon">ℹ️</span>
//               <div>
//                 <strong>No tienes un perfil de oferente</strong>
//                 <p>Crea tu perfil para empezar a ofrecer tus servicios o productos.</p>
//                 <Link to="/oferentes/crear" className="btn btn-primary" style={{ marginTop: '10px' }}>
//                   Crear Mi Perfil de Oferente
//                 </Link>
//               </div>
//             </div>
//           </div>
//         )}

//         {isOferente && (
//   <div className="header-actions">
//   {/* Crear oferente */}
//   {(!isOferente || !hasOferenteProfile) && (
//     <Link to="/oferentes/crear" className="btn btn-primary">
//       + {isOferente ? 'Crear Mi Perfil' : 'Nuevo Oferente'}
//     </Link>
//   )}

//   {/* Botón conectar Mercado Pago */}
//   {isOferente && hasOferenteProfile && (
//     <button
//       onClick={connectMercadoPago}
//       className="btn btn-success"
//       style={{ marginLeft: "10px" }}
//     >
//       💳 Conectar Mercado Pago
//     </button>
//   )}
// </div>
 
//         )}

//         {/* Show content only if there are oferentes to display */}
//         {(oferentes.length > 0) && (
//           <div className="usuarios-content">
//             {/* Estadísticas - Only show for admins or if oferente has profile */}
//             {(!isOferente || hasOferenteProfile) && (
//               <div className="usuarios-stats">
//                 <div className="stat-card">
//                   <div className="stat-value">{oferentes.length}</div>
//                   <div className="stat-label">{isOferente ? 'Mi Perfil' : 'Total Oferentes'}</div>
//                 </div>
//                 <div className="stat-card">
//                   <div className="stat-value">
//                     {oferentes.filter(o => o.estado === 'aprobado').length}
//                   </div>
//                   <div className="stat-label">Aprobados</div>
//                 </div>
//                 <div className="stat-card">
//                   <div className="stat-value">
//                     {oferentes.filter(o => o.estado === 'pendiente').length}
//                   </div>
//                   <div className="stat-label">Pendientes</div>
//                 </div>
//                 {!isOferente && (
//                   <>
//                     <div className="stat-card">
//                       <div className="stat-value">
//                         {oferentes.filter(o => o.tipo === 'restaurante').length}
//                       </div>
//                       <div className="stat-label">Restaurantes</div>
//                     </div>
//                     <div className="stat-card">
//                       <div className="stat-value">
//                         {oferentes.filter(o => o.tipo === 'artesanal').length}
//                       </div>
//                       <div className="stat-label">Artesanales</div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}

//             {/* Filtros - Only show for admins when there are multiple oferentes */}
//             {!isOferente && oferentes.length > 1 && (
//               <div className="filters-section">
//                 <div className="filters-row">
//                   <div className="filter-group">
//                     <label htmlFor="filter-estado">Estado:</label>
//                     <select
//                       id="filter-estado"
//                       name="estado"
//                       value={filters.estado}
//                       onChange={handleFilterChange}
//                     >
//                       <option value="">Todos</option>
//                       <option value="pendiente">Pendiente</option>
//                       <option value="aprobado">Aprobado</option>
//                       <option value="suspendido">Suspendido</option>
//                     </select>
//                   </div>

//                   <div className="filter-group">
//                     <label htmlFor="filter-tipo">Tipo:</label>
//                     <select
//                       id="filter-tipo"
//                       name="tipo"
//                       value={filters.tipo}
//                       onChange={handleFilterChange}
//                     >
//                       <option value="">Todos</option>
//                       <option value="restaurante">Restaurante</option>
//                       <option value="artesanal">Artesanal</option>
//                     </select>
//                   </div>

//                   {(filters.estado || filters.tipo) && (
//                     <button 
//                       onClick={clearFilters}
//                       className="btn btn-secondary btn-sm"
//                     >
//                       Limpiar Filtros
//                     </button>
//                   )}
//                 </div>
//                 <div className="results-count">
//                   Mostrando {filteredOferentes.length} de {oferentes.length} oferentes
//                 </div>
//               </div>
//             )}

//             {/* Tabla de oferentes */}
//             <div className="usuarios-table-container">
//               <table className="usuarios-table">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Nombre Negocio</th>
//                     {!isOferente && <th>Propietario</th>}
//                     <th>Tipo</th>
//                     <th>Estado</th>
//                     <th>Teléfono</th>
//                     <th>Dirección</th>
//                     <th>Acciones</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOferentes.length === 0 ? (
//                     <tr>
//                       <td colSpan={isOferente ? "7" : "8"} className="text-center">
//                         No se encontraron oferentes
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredOferentes.map((oferente) => (
//                       <tr key={oferente.id_oferente}>
//                         <td>{oferente.id_oferente}</td>
//                         <td>
//                           <strong>{oferente.nombre_negocio}</strong>
//                         </td>
//                         {!isOferente && (
//                           <td>
//                             {oferente.nombre_usuario}
//                             <br />
//                             <small>{oferente.correo_usuario}</small>
//                           </td>
//                         )}
//                         <td>
//                           <span className={`badge badge-${oferente.tipo}`}>
//                             {oferente.tipo === 'restaurante' ? '🍽️' : '🎨'} {oferente.tipo}
//                           </span>
//                         </td>
//                         <td>
//                           {!isOferente ? (
//                             <select
//                               value={oferente.estado}
//                               onChange={(e) => handleEstadoChange(oferente.id_oferente, e.target.value)}
//                               className={`estado-select ${getEstadoBadgeClass(oferente.estado)}`}
//                             >
//                               <option value="pendiente">Pendiente</option>
//                               <option value="aprobado">Aprobado</option>
//                               <option value="suspendido">Suspendido</option>
//                             </select>
//                           ) : (
//                             <span className={`badge ${getEstadoBadgeClass(oferente.estado)}`}>
//                               {oferente.estado}
//                             </span>
//                           )}
//                         </td>
//                         <td>{oferente.telefono || 'N/A'}</td>
//                         <td>
//                           <small>{oferente.direccion || 'N/A'}</small>
//                         </td>
//                         <td className="actions">
//                           {canEditOferente(oferente) ? (
//                             <>
//                               <Link
//                                 to={`/oferentes/editar/${oferente.id_oferente}`}
//                                 className="btn-action btn-edit"
//                                 title="Editar"
//                               >
//                                 ✏️
//                               </Link>
//                               {!isOferente && (
//                                 <button
//                                   onClick={() => handleDelete(oferente.id_oferente)}
//                                   className="btn-action btn-delete"
//                                   title="Eliminar"
//                                 >
//                                   🗑️
//                                 </button>
//                               )}
//                             </>
//                           ) : (
//                             <span className="text-muted">-</span>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }

// export default Oferentes;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { oferentesAPI } from '../services/api';
import Layout from '../components/Layout';
import '../styles/Usuarios.css';

function Oferentes() {
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

  // ── MercadoPago states ──────────────────────────────────────────────
  const [mpEstado, setMpEstado] = useState(null);       // 'pendiente' | 'activo' | 'rechazado'
  const [mpLoading, setMpLoading] = useState(false);
  const [mpMensaje, setMpMensaje] = useState('');

  useEffect(() => {
    initializeComponent();
    checkMpQueryParams();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [oferentes, filters]);

  // Revisar si MP redirigió de vuelta con resultado
  const checkMpQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const mpStatus = params.get('mp_status');
    const mpError  = params.get('mp_error');

    if (mpStatus === 'conectado') {
      setMpMensaje('✅ ¡Cuenta de MercadoPago conectada exitosamente!');
      fetchMpEstado();
    } else if (mpError) {
      setMpMensaje(`❌ Error al conectar con MercadoPago: ${mpError.replace(/_/g, ' ')}`);
    }

    // Limpiar query params de la URL
    if (mpStatus || mpError) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const initializeComponent = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setCurrentUser(userData);

      if (userData && userData.rol === 'oferente') {
        setIsOferente(true);
        await fetchOferentesByUser(userData.id_usuario);
        await fetchMpEstado();
      } else {
        await fetchOferentes();
      }
    } catch (err) {
      setError('Error al inicializar el componente');
      console.error('Init error:', err);
    }
  };

  // Consultar estado MP del oferente logueado
  const fetchMpEstado = async () => {
   try {
    const token = localStorage.getItem('token');
    if (!token) return; // No hay sesión activa, salir silenciosamente
    
    const data = await mercadopagoAPI.getEstado();
      if (data.ok) {
        setMpEstado(data.mp_estado);
      }
    } catch (err) {
      // Si falla silenciosamente — el oferente no tiene perfil aún
      console.log('MP estado no disponible:', err.message);
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

      if (err.message && !err.message.includes('404')) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Conectar con MercadoPago ────────────────────────────────────────
  const connectMercadoPago = async () => {
    try {
      setMpLoading(true);
      setMpMensaje('');

      const data = await mercadopagoAPI.getOAuthUrl();

      if (data.ok && data.auth_url) {
        // Redirigir a MercadoPago para autorizar
        window.location.href = data.auth_url;
      } else {
        setMpMensaje('❌ No se pudo obtener la URL de autorización');
      }
    } catch (err) {
      setMpMensaje(`❌ Error: ${err.message}`);
    } finally {
      setMpLoading(false);
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
    setFilters({ estado: '', tipo: '' });
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    if (isOferente) {
      alert('No tienes permiso para cambiar el estado');
      return;
    }

    if (!window.confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) return;

    try {
      await oferentesAPI.updateEstado(id, { estado: nuevoEstado });
      alert('Estado actualizado exitosamente');
      fetchOferentes();
    } catch (err) {
      alert(err.message || 'Error al actualizar estado');
    }
  };

  const handleDelete = async (id) => {
    if (isOferente) {
      alert('No tienes permiso para eliminar oferentes');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar este oferente?')) return;

    try {
      await oferentesAPI.delete(id);
      alert('Oferente eliminado exitosamente');
      fetchOferentes();
    } catch (err) {
      alert(err.message || 'Error al eliminar oferente');
    }
  };

  const canEditOferente = (oferente) => {
    if (!isOferente) return true;

    // Oferentes can only edit their own
    return oferente.id_usuario === currentUser?.id_usuario;
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'aprobado': return 'badge-success';
      case 'pendiente': return 'badge-warning';
      case 'suspendido': return 'badge-danger';
      default:           return 'badge-default';
    }
  };

  // Badge de estado MP
  const getMpBadge = () => {
    if (!mpEstado) return null;
    const config = {
      activo:    { clase: 'badge-success', texto: '✅ MercadoPago Conectado' },
      pendiente: { clase: 'badge-warning', texto: '⏳ MercadoPago Pendiente' },
      rechazado: { clase: 'badge-danger',  texto: '❌ MercadoPago Rechazado'  },
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
              <h1>{isOferente ? 'Mi Perfil de Oferente' : 'Gestión de Oferentes'}</h1>
              {currentUser && (
                <p className="welcome-text">
                  Bienvenido, {currentUser.nombre} ({currentUser.rol})
                </p>
              )}
            </div>
            <div className="header-actions">
              {(!isOferente || !hasOferenteProfile) && (
                <Link to="/oferentes/crear" className="btn btn-primary">
                  + {isOferente ? 'Crear Mi Perfil' : 'Nuevo Oferente'}
                </Link>
              )}

              {/* ── Botón MercadoPago — solo para oferentes con perfil ── */}
              {isOferente && hasOferenteProfile && (
                <button
                  onClick={connectMercadoPago}
                  disabled={mpLoading || mpEstado === 'activo'}
                  className="btn btn-success"
                  style={{ marginLeft: '10px' }}
                  title={mpEstado === 'activo' ? 'Tu cuenta ya está conectada' : 'Conecta tu cuenta de MercadoPago para recibir pagos'}
                >
                  {mpLoading
                    ? '⏳ Conectando...'
                    : mpEstado === 'activo'
                      ? '✅ MP Conectado'
                      : '💳 Conectar MercadoPago'}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Mensaje resultado OAuth MP */}
        {mpMensaje && (
          <div className={`alert ${mpMensaje.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}
            style={{ margin: '0 0 16px 0' }}>
            {mpMensaje}
          </div>
        )}

        {/* Badge estado MP */}
        {isOferente && hasOferenteProfile && mpEstado && (
          <div style={{ marginBottom: '12px' }}>
            {getMpBadge()}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {/* Sin perfil de oferente */}
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

        {/* Tabla de oferentes */}
        {(oferentes.length > 0) && (
          <div className="usuarios-content">
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
