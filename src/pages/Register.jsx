import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuariosAPI } from '../services/api';
import '../styles/Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password length
    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await usuariosAPI.register(formData);
      
      // Store user info
      localStorage.setItem('currentUser', JSON.stringify(response.usuario));
      
      // Show success message and redirect
      alert('¡Cuenta creada exitosamente!');
      navigate('/usuarios');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>
        <p className="subtitle">Únete a la comunidad de Arroyo Seco</p>

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
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="••••••••"
              value={formData.contrasena}
              onChange={handleChange}
              required
              minLength={6}
            />
            <small className="form-hint">Mínimo 6 caracteres</small>
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
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;