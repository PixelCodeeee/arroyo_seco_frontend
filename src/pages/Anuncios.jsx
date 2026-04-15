import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { announcementsAPI } from '../services/api';
import Layout from '../components/Layout';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'sonner';
import '../styles/Usuarios.css';

function Anuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  // ✅ ROLES
  const isAdmin = currentUser?.rol === 'admin';
  const isModerador = currentUser?.rol === 'moderador';

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const fetchAnuncios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await announcementsAPI.getAll();
      setAnuncios(data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar anuncios');
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id) => {
    if (!isAdmin) {
      toast.error('No tienes permisos para eliminar anuncios');
      return;
    }
    setConfirmDelete({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await announcementsAPI.delete(confirmDelete.id);
      toast.success('Anuncio eliminado');
      fetchAnuncios();
    } catch {
      toast.error('Error al eliminar');
    } finally {
      setConfirmDelete({ isOpen: false, id: null });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="usuarios-container">
          <div className="loading">Cargando anuncios...</div>
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
              <h1>Anuncios y Festividades</h1>
              {currentUser && (
                <p className="welcome-text">
                  Bienvenido, {currentUser.nombre} ({currentUser.rol})
                </p>
              )}
            </div>

            {/* ✅ SOLO ADMIN CREA */}
            {isAdmin && (
              <Link to="/anuncios/crear" className="btn btn-primary">
                + Nuevo Anuncio
              </Link>
            )}
          </div>
        </header>

        {/* 🔥 AVISO MODERADOR */}
        {isModerador && (
          <div style={{
            backgroundColor: "var(--bg-card)",
            padding: "1rem",
            borderRadius: "8px",
            borderLeft: "4px solid var(--info-color)",
            marginBottom: "1.5rem"
          }}>
            ⚠️ Estás en modo supervisión. Solo puedes visualizar los anuncios.
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="usuarios-content">

          {/* STATS */}
          <div className="usuarios-stats">
            <div className="stat-card">
              <div className="stat-value">{anuncios.length}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {anuncios.filter(a => a.is_active).length}
              </div>
              <div className="stat-label">Activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {anuncios.filter(a => !a.is_active).length}
              </div>
              <div className="stat-label">Inactivos</div>
            </div>
          </div>

          {/* TABLA */}
          <div className="usuarios-table-container table-responsive">
            <table className="usuarios-table">
              <thead>
                <tr>
               
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Fecha Evento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {anuncios.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                      No hay anuncios registrados aún
                    </td>
                  </tr>
                ) : (
                  anuncios.map(a => (
                    <tr key={a.id}>
              
                      <td data-label="Título">{a.title}</td>
                      <td data-label="Descripción">
                        {a.description?.substring(0, 60)}...
                      </td>
                      <td data-label="Fecha Evento">
                        {a.event_date
                          ? new Date(a.event_date).toLocaleDateString('es-MX')
                          : '—'}
                      </td>
                      <td data-label="Estado">
                        <span className={`status ${a.is_active ? 'active' : 'inactive'}`}>
                          {a.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td data-label="Acciones" className="actions">

                        {/* ✅ SOLO ADMIN EDITA */}
                        {isAdmin && (
                          <Link
                            to={`/anuncios/editar/${a.id}`}
                            className="btn-action btn-edit"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </Link>
                        )}

                        {/* ❌ SOLO ADMIN ELIMINA */}
                        {isAdmin && (
                          <button
                            onClick={() => requestDelete(a.id)}
                            className="btn-action btn-delete"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}

                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Eliminar Anuncio"
        message="¿Estás seguro de que deseas eliminar este anuncio del sistema?"
        onConfirm={executeDelete}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        confirmText="Eliminar"
      />
    </Layout>
  );
}

export default Anuncios;