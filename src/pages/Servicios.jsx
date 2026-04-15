import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { serviciosAPI } from '../services/api';
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

  const requestDelete = (id) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await serviciosAPI.delete(confirmDelete.id);
      setConfirmDelete({ isOpen: false, id: null });
      toast.success('Servicio eliminado exitosamente');
      fetchServicios();
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
                    const isActive = s.estatus === true; // Prisma already returns boolean

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
                          <button
                            onClick={() => requestDelete(s.id_servicio)}
                            className="btn-action btn-delete"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
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