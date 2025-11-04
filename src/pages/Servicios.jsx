import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { serviciosAPI } from '../services/api';
import '../styles/Usuarios.css';

function Servicios() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [stats, setStats] = useState({ total: 0, disponibles: 0, no_disponibles: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      const response = await serviciosAPI.getAll();
      setServicios(response.servicios);
      setStats(response.stats);
    } catch (err) {
      setError(err.message || 'Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) {
      return;
    }

    try {
      await serviciosAPI.delete(id);
      alert('Servicio eliminado exitosamente');
      fetchServicios();
    } catch (err) {
      alert(err.message || 'Error al eliminar servicio');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="usuarios-container">
        <div className="loading">Cargando servicios...</div>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      <header className="usuarios-header">
        <div className="header-content">
          <div>
            <h1>Gestión de Servicios</h1>
            {currentUser && (
              <p className="welcome-text">
                Bienvenido, {currentUser.nombre} ({currentUser.rol})
              </p>
            )}
          </div>
          <div className="header-actions">
            <Link to="/servicios/crear" className="btn btn-primary">
              + Nuevo Servicio
            </Link>
            <Link to="/oferentes" className="btn btn-outline">
              Ver Oferentes
            </Link>
            <button onClick={handleLogout} className="btn btn-outline">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="usuarios-content">
        <div className="usuarios-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Servicios</div>
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

        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Negocio</th>
                <th>Rango Precio</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio.id_servicio}>
                  <td>{servicio.id_servicio}</td>
                  <td>{servicio.nombre}</td>
                  <td>{servicio.nombre_negocio}</td>
                  <td>{servicio.rango_precio || 'N/A'}</td>
                  <td>{servicio.capacidad || 'N/A'}</td>
                  <td>
                    <span className={`status ${servicio.esta_disponible ? 'active' : 'inactive'}`}>
                      {servicio.esta_disponible ? 'Disponible' : 'No Disponible'}
                    </span>
                  </td>
                  <td>{servicio.nombre_categoria || 'Sin categoría'}</td>
                  <td className="actions">
                    <Link
                      to={`/servicios/editar/${servicio.id_servicio}`}
                      className="btn-action btn-edit"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(servicio.id_servicio)}
                      className="btn-action btn-delete"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Servicios;