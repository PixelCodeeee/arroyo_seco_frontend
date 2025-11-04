import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { oferentesAPI } from '../services/api';
import '../styles/Usuarios.css';

function Oferentes() {
  const navigate = useNavigate();
  const [oferentes, setOferentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    fetchOferentes();
  }, []);

  const fetchOferentes = async () => {
    try {
      setLoading(true);
      const response = await oferentesAPI.getAll();
      setOferentes(response.oferentes);
    } catch (err) {
      setError(err.message || 'Error al cargar oferentes');
    } finally {
      setLoading(false);
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
        <div className="usuarios-stats">
          <div className="stat-card">
            <div className="stat-value">{oferentes.length}</div>
            <div className="stat-label">Total Oferentes</div>
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

        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Negocio</th>
                <th>Propietario</th>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {oferentes.map((oferente) => (
                <tr key={oferente.id_oferente}>
                  <td>{oferente.id_oferente}</td>
                  <td>{oferente.nombre_negocio}</td>
                  <td>{oferente.nombre_usuario}</td>
                  <td>{oferente.correo_usuario}</td>
                  <td>
                    <span className={`badge badge-${oferente.tipo}`}>
                      {oferente.tipo}
                    </span>
                  </td>
                  <td>{oferente.direccion || 'N/A'}</td>
                  <td className="actions">
                    <Link
                      to={`/oferentes/editar/${oferente.id_oferente}`}
                      className="btn-action btn-edit"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(oferente.id_oferente)}
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

export default Oferentes;