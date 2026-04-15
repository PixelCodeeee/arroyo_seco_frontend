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

  // ❌ eliminar bloqueado
  const requestDelete = () => {
    toast.error('No tienes permisos para eliminar usuarios');
  };

  const executeDelete = async () => {
    setConfirmDelete({ isOpen: false, id: null });
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
              {/* Solo admin puede crear */}
              {isAdmin && (
                <Link to="/register" className="btn btn-primary">
                  + Nuevo Usuario
                </Link>
              )}
            </div>
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

          {/* TABLA */}
          <div className="usuarios-table-container table-responsive">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>

                  {/* ❌ ocultar columna para moderador */}
                  {isAdmin && <th>Acciones</th>}
                </tr>
              </thead>

              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.id_usuario}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>

                    <td>
                      <span className={`badge badge-${usuario.rol}`}>
                        {usuario.rol}
                      </span>
                    </td>

                    <td>
                      <span className={`status ${usuario.esta_activo ? 'active' : 'inactive'}`}>
                        {usuario.esta_activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      {new Date(usuario.fecha_creacion).toLocaleDateString()}
                    </td>

                    {/* ✅ SOLO ADMIN VE ACCIONES */}
                    {isAdmin && (
                      <td className="actions">
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