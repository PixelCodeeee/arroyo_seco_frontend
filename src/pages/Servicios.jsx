import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviciosAPI } from '../services/api';
import Layout from '../components/Layout';
import '../styles/Usuarios.css';

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [stats, setStats] = useState({ total: 0, disponibles: 0, no_disponibles: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  // Cargar datos
  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviciosAPI.getAll(); // ← devuelve { servicios, stats, total }
      setServicios(data.servicios || []);
      setStats(data.stats || { total: 0, disponibles: 0, no_disponibles: 0 });
    } catch (err) {
      console.error(err);
      setError('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este servicio?')) return;

    try {
      await serviciosAPI.delete(id);
      alert('Servicio eliminado');
      fetchServicios();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
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
            <Link to="/servicios/crear" className="btn btn-primary">
              + Nuevo Servicio
            </Link>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        {/* Estadísticas */}
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

          {/* Tabla */}
          <div className="usuarios-table-container">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
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
                  servicios.map(s => (
                    <tr key={s.id_servicio}>
                      <td>{s.id_servicio}</td>
                      <td>
                        {/* Aquí deberías tener el nombre del oferente si lo traes en el backend */}
                        #{s.id_oferente}
                      </td>
                      <td>{s.nombre}</td>
                      <td>{s.rango_precio || '—'}</td>
                      <td>{s.capacidad ? `${s.capacidad} pers.` : '—'}</td>
                      <td>
                        <span className={`status ${s.estatus === 1 ? 'active' : 'inactive'}`}>
                          {s.estatus === 1 ? 'Disponible' : 'No Disponible'}
                        </span>
                      </td>
                      <td className="actions">
                        <Link
                          to={`/servicios/editar/${s.id_servicio}`}
                          className="btn-action btn-edit"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(s.id_servicio)}
                          className="btn-action btn-delete"
                        >
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

export default Servicios;