import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Search } from 'lucide-react';
import { usuariosAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import Layout from '../components/Layout';
import { toast } from 'sonner';
import '../styles/Usuarios.css';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const isAdmin = currentUser?.rol === 'admin';
  const isModerador = currentUser?.rol === 'moderador';

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Derive filtered list whenever data or filters change
  useEffect(() => {
    let data = [...usuarios];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(u =>
        (u.nombre || '').toLowerCase().includes(term) ||
        (u.correo || '').toLowerCase().includes(term)
      );
    }
    if (filterRol) {
      data = data.filter(u => u.rol === filterRol);
    }
    if (filterStatus === 'activo') {
      data = data.filter(u => u.esta_activo);
    } else if (filterStatus === 'inactivo') {
      data = data.filter(u => !u.esta_activo);
    }
    setFiltered(data);
  }, [searchTerm, filterRol, filterStatus, usuarios]);

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

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRol('');
    setFilterStatus('');
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

          {/* SEARCH & FILTERS */}
          <div className="ordenes-controls" style={{ marginBottom: '1.5rem' }}>
            <div className="search-box">
              <span className="search-icon"><Search size={18} /></span>
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              {['', 'turista', 'oferente', 'admin', 'moderador'].map(rol => (
                <button
                  key={rol}
                  className={`filter-btn ${filterRol === rol ? 'active' : ''}`}
                  onClick={() => setFilterRol(rol)}
                >
                  {rol === '' ? 'Todos' : rol.charAt(0).toUpperCase() + rol.slice(1)}
                </button>
              ))}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">Estado: Todos</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
              {(searchTerm || filterRol || filterStatus) && (
                <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                  Limpiar Filtros
                </button>
              )}
            </div>
          </div>

          <div className="results-count" style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Mostrando {filtered.length} de {usuarios.length} usuarios
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
                {filtered.map((usuario) => (
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
