import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { usuariosAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import Layout from '../components/Layout';
import { toast } from 'sonner';
import '../styles/Usuarios.css';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const isAdmin = currentUser?.rol === 'admin';
  const isModerador = currentUser?.rol === 'moderador';

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuariosAPI.getAll();
      setUsuarios(response.usuarios);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id) => {
    if (isModerador) {
      toast.error('No tienes permisos para eliminar usuarios');
      return;
    }
    setConfirmDelete({ isOpen: true, id });
  };

  const executeDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await usuariosAPI.delete(confirmDelete.id);
      setConfirmDelete({ isOpen: false, id: null });
      toast.success('Usuario eliminado exitosamente');
      fetchUsuarios();
    } catch (err) {
      setConfirmDelete({ isOpen: false, id: null });
      toast.error(err.message || 'Error al eliminar usuario');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="usuarios-container">
          <div className="loading">Cargando usuarios...</div>
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
              <h1>Gestión de Usuarios</h1>
              {currentUser && (
                <p className="welcome-text">
                  Bienvenido, {currentUser.nombre} ({currentUser.rol})
                </p>
              )}
            </div>

            <div className="header-actions">
              {isAdmin && (
                <Link to="/register" className="btn btn-primary">
                  + Nuevo Usuario
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Moderator notice */}
        {isModerador && (
          <div style={{
            backgroundColor: "var(--bg-card)",
            padding: "1rem",
            borderRadius: "8px",
            borderLeft: "4px solid var(--info-color)",
            marginBottom: "1.5rem"
          }}>
            ⚠️ Estás en modo supervisión. Solo puedes visualizar los usuarios.
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {/* STATS */}
        <div className="usuarios-content">
          <div className="usuarios-stats">
            <div className="stat-card">
              <div className="stat-value">{usuarios.length}</div>
              <div className="stat-label">Total Usuarios</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {usuarios.filter(u => u.rol === 'turista').length}
              </div>
              <div className="stat-label">Turistas</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {usuarios.filter(u => u.rol === 'oferente').length}
              </div>
              <div className="stat-label">Oferentes</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {usuarios.filter(u => u.esta_activo).length}
              </div>
              <div className="stat-label">Activos</div>
            </div>
          </div>

          {/* TABLE */}
          <div className="usuarios-table-container table-responsive">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  {isAdmin && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td data-label="Nombre">{usuario.nombre}</td>
                    <td data-label="Correo">{usuario.correo}</td>
                    <td data-label="Rol">
                      <span className={`badge badge-${usuario.rol}`}>
                        {usuario.rol.toUpperCase()}
                      </span>
                    </td>
                    <td data-label="Estado">
                      <span className={`status ${usuario.esta_activo ? 'active' : 'inactive'}`}>
                        {usuario.esta_activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td data-label="Fecha Creación">
                      {new Date(usuario.fecha_creacion).toLocaleDateString()}
                    </td>
                    {isAdmin && (
                      <td data-label="Acciones" className="actions">
                        <Link
                          to={`/usuarios/editar/${usuario.id_usuario}`}
                          className="btn-action btn-edit"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => requestDelete(usuario.id_usuario)}
                          className="btn-action btn-delete"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Eliminar usuario"
        message="¿Estás seguro?"
        onConfirm={executeDelete}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
      />
    </Layout>
  );
}

export default Usuarios;