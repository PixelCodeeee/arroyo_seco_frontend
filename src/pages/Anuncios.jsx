import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { announcementsAPI } from '../services/api';
import Layout from '../components/Layout';
import '../styles/Usuarios.css';

function Anuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

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

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este anuncio?')) return;
    try {
      await announcementsAPI.delete(id);
      alert('Anuncio eliminado');
      fetchAnuncios();
    } catch {
      alert('Error al eliminar');
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
            <Link to="/anuncios/crear" className="btn btn-primary">
              + Nuevo Anuncio
            </Link>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        <div className="usuarios-content">
          <div className="usuarios-stats">
            <div className="stat-card">
              <div className="stat-value">{anuncios.length}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{anuncios.filter(a => a.is_active).length}</div>
              <div className="stat-label">Activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{anuncios.filter(a => !a.is_active).length}</div>
              <div className="stat-label">Inactivos</div>
            </div>
          </div>

          <div className="usuarios-table-container">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
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
                      <td>{a.id}</td>
                      <td>{a.title}</td>
                      <td>{a.description?.substring(0, 60)}...</td>
                      <td>{a.event_date ? new Date(a.event_date).toLocaleDateString('es-MX') : '—'}</td>
                      <td>
                        <span className={`status ${a.is_active ? 'active' : 'inactive'}`}>
                          {a.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="actions">
                        <Link to={`/anuncios/editar/${a.id}`} className="btn-action btn-edit">
                          Editar
                        </Link>
                        <button onClick={() => handleDelete(a.id)} className="btn-action btn-delete">
                          Eliminar
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
    </Layout>
  );
}

export default Anuncios;