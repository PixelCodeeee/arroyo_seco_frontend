import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Info, Store, AlertTriangle } from 'lucide-react';
import { serviciosAPI, oferentesAPI } from '../services/api';
import Layout from '../components/Layout';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'sonner';
import '../styles/Usuarios.css';

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [stats, setStats] = useState({ total: 0, disponibles: 0, no_disponibles: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const isOferente = currentUser?.rol === 'oferente';
  const isAdmin = currentUser?.rol === 'admin';

  // Oferente-specific state
  const [hasOferenteProfile, setHasOferenteProfile] = useState(true);
  const [oferenteTipo, setOferenteTipo] = useState(null);
  const isModerador = currentUser?.rol === 'moderador';

  useEffect(() => {
    initializeAndFetch();
  }, []);

  const initializeAndFetch = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isOferente) {
        // Check oferente profile and tipo
        try {
          const miOferente = await oferentesAPI.getByUserId(currentUser.id_usuario);
          if (!miOferente || !miOferente.id_oferente) {
            setHasOferenteProfile(false);
            setLoading(false);
            return;
          }
          setHasOferenteProfile(true);
          setOferenteTipo(miOferente.tipo);

          // If not restaurant, don't fetch servicios
          if (miOferente.tipo !== 'restaurante') {
            setLoading(false);
            return;
          }
        } catch {
          setHasOferenteProfile(false);
          setLoading(false);
          return;
        }
      }

      // Fetch servicios (either admin or restaurant oferente)
      const data = await serviciosAPI.getAll();
      setServicios(data.servicios || []);
      setStats(data.stats || { total: 0, disponibles: 0, no_disponibles: 0 });
    } catch (err) {
      console.error(err);
      if (err.message?.includes('403') || err.message?.includes('oferente')) {
        setHasOferenteProfile(false);
      } else {
        setError('Error al cargar servicios');
      }
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await serviciosAPI.delete(confirmDelete.id);
      setConfirmDelete({ isOpen: false, id: null });
      toast.success('Servicio eliminado exitosamente');
      initializeAndFetch();
    } catch (err) {
      setConfirmDelete({ isOpen: false, id: null });
      toast.error(err.response?.data?.error || 'Error al eliminar');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="usuarios-container">
          <div className="loading">Cargando servicios...</div>
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
              <h1>Servicios de Restaurante</h1>
              {currentUser && (
                <p className="welcome-text">
                  Bienvenido, {currentUser.nombre} ({currentUser.rol})
                </p>
              )}
            </div>
            {!isModerador && (
              <Link
                to="/servicios/crear"
                className="btn btn-primary"
                style={isOferente && (!hasOferenteProfile || oferenteTipo !== 'restaurante') ? { pointerEvents: 'none', opacity: 0.5 } : {}}
              >
                + Nuevo Servicio
              </Link>
            )}
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        {/* Oferente without profile */}
        {isOferente && !hasOferenteProfile && (
          <div className="usuarios-content">
            <div className="alert alert-info" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '20px', borderRadius: 8, background: 'var(--info-bg, #e0f2fe)', color: 'var(--info-color, #0369a1)', border: '1px solid var(--info-border, #7dd3fc)' }}>
              <Info size={22} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: '1.05em' }}>Necesitas crear tu perfil de oferente para gestionar servicios.</strong>
                <p style={{ marginTop: 8, opacity: 0.9 }}>Antes de crear servicios de restaurante, debes registrar tu negocio como oferente.</p>
                <Link to="/oferentes/crear" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>
                  <Store size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Crear Mi Perfil de Oferente
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Oferente with wrong tipo */}
        {isOferente && hasOferenteProfile && oferenteTipo && oferenteTipo !== 'restaurante' && (
          <div className="usuarios-content">
            <div className="alert alert-info" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '20px', borderRadius: 8, background: 'var(--warning-bg, #fefce8)', color: 'var(--warning-color, #854d0e)', border: '1px solid var(--warning-border, #fde047)' }}>
              <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: '1.05em' }}>Esta sección es exclusiva para restaurantes.</strong>
                <p style={{ marginTop: 8, opacity: 0.9 }}>
                  Los servicios están diseñados para oferentes tipo restaurante que desean ofrecer experiencias culinarias,
                  servicios de buffet, eventos gastronómicos y similares.
                </p>
                <p style={{ marginTop: 4, fontSize: '0.9em', opacity: 0.7 }}>
                  Tu perfil es de tipo <strong>{oferenteTipo}</strong>. Puedes gestionar tus productos desde la sección de Productos.
                </p>
                <Link to="/productos" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>
                  Ir a Productos
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Oferente without profile */}
        {isOferente && !hasOferenteProfile && (
          <div className="usuarios-content">
            <div className="alert alert-info" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '20px', borderRadius: 8, background: 'var(--info-bg, #e0f2fe)', color: 'var(--info-color, #0369a1)', border: '1px solid var(--info-border, #7dd3fc)' }}>
              <Info size={22} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: '1.05em' }}>Necesitas crear tu perfil de oferente para gestionar servicios.</strong>
                <p style={{ marginTop: 8, opacity: 0.9 }}>Antes de crear servicios de restaurante, debes registrar tu negocio como oferente.</p>
                <Link to="/oferentes/crear" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>
                  <Store size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Crear Mi Perfil de Oferente
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Oferente with wrong tipo */}
        {isOferente && hasOferenteProfile && oferenteTipo && oferenteTipo !== 'restaurante' && (
          <div className="usuarios-content">
            <div className="alert alert-info" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '20px', borderRadius: 8, background: 'var(--warning-bg, #fefce8)', color: 'var(--warning-color, #854d0e)', border: '1px solid var(--warning-border, #fde047)' }}>
              <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: '1.05em' }}>Esta sección es exclusiva para restaurantes.</strong>
                <p style={{ marginTop: 8, opacity: 0.9 }}>
                  Los servicios están diseñados para oferentes tipo restaurante que desean ofrecer experiencias culinarias,
                  servicios de buffet, eventos gastronómicos y similares.
                </p>
                <p style={{ marginTop: 4, fontSize: '0.9em', opacity: 0.7 }}>
                  Tu perfil es de tipo <strong>{oferenteTipo}</strong>. Puedes gestionar tus productos desde la sección de Productos.
                </p>
                <Link to="/productos" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>
                  Ir a Productos
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="usuarios-content">
          <div className="usuarios-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.disponibles}</div>
              <div className="stat-label">Disponibles</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.no_disponibles}</div>
              <div className="stat-label">No Disponibles</div>
            </div>
          </div>

          <div className="usuarios-table-container table-responsive">
            <table className="usuarios-table">
              <thead>
                <tr>

                  <th>Restaurante</th>
                  <th>Servicio</th>
                  <th>Rango Precio</th>
                  <th>Capacidad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      No hay servicios registrados aún
                    </td>
                  </tr>
                ) : (
                  servicios.map(s => {
                    const isActive = s.estatus === true;
                    return (
                      <tr key={s.id_servicio}>

                        <td data-label="Restaurante">#{s.id_oferente}</td>
                        <td data-label="Servicio">{s.nombre}</td>
                        <td data-label="Rango Precio">{s.rango_precio || '—'}</td>
                        <td data-label="Capacidad">{s.capacidad ? `${s.capacidad} pers.` : '—'}</td>
                        <td data-label="Estado">
                          <span className={`status ${isActive ? 'active' : 'inactive'}`}>
                            {isActive ? 'Disponible' : 'No Disponible'}
                          </span>
                        </td>
                        <td data-label="Acciones" className="actions">
                          <Link
                            to={`/servicios/editar/${s.id_servicio}`}
                            className="btn-action btn-edit"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </Link>
                          {!isModerador && (
                            <button
                              onClick={() => requestDelete(s.id_servicio)}
                              className="btn-action btn-delete"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Eliminar servicio"
        message="¿Estás seguro de que deseas eliminar este servicio? Esta acción no puede revertirse."
        onConfirm={executeDelete}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        confirmText="Eliminar"
      />
    </Layout>
  );
}

export default Servicios;