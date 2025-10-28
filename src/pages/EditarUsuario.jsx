import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usuariosAPI } from '../services/api';
import '../styles/Auth.css';

function EditarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    rol: '',
    esta_activo: true,
    contrasena: '', // Optional - only if changing password
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsuario();
  }, [id]);

  const fetchUsuario = async () => {
    try {
      setLoading(true);
      const usuario = await usuariosAPI.getById(id);
      setFormData({
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        esta_activo: usuario.esta_activo,
        contrasena: '',
      });
    } catch (err) {
      setError(err.message || 'Error al cargar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Prepare data - only send fields that should be updated
      const updateData = {
        nombre: formData.nombre,
        correo: formData.correo,
        rol: formData.rol,
        esta_activo: formData.esta_activo,
      };

      // Only include password if it's being changed
      if (formData.contrasena && formData.contrasena.length > 0) {
        if (formData.contrasena.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setSaving(false);
          return;
        }
        updateData.contrasena = formData.contrasena;
      }

      await usuariosAPI.update(id, updateData);
      alert('Usuario actualizado exitosamente');
      navigate('/usuarios');
    } catch (err) {
      setError(err.message || 'Error al actualizar usuario');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="form-header">
          <Link to="/usuarios" className="back-link">
            ← Volver a la lista
          </Link>
          <h1>Editar Usuario</h1>
          <p className="subtitle">ID: {id}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="tu@correo.com"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rol">Tipo de Usuario</label>
            <select 
              id="rol" 
              name="rol" 
              value={formData.rol}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="turista">Turista</option>
              <option value="oferente">Oferente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Nueva Contraseña (opcional)</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Dejar en blanco para mantener la actual"
              value={formData.contrasena}
              onChange={handleChange}
            />
            <small className="form-hint">
              Solo completa este campo si deseas cambiar la contraseña
            </small>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="esta_activo"
                checked={formData.esta_activo}
                onChange={handleChange}
              />
              <span>Usuario activo</span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <Link to="/usuarios" className="btn btn-outline">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarUsuario;