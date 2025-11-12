import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuariosAPI } from '../services/api';
import TwoFactorVerification from '../components/TwoFactorVerification';
import '../styles/Auth.css';

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState('registration'); // 'registration' or '2fa'
  const [userId, setUserId] = useState(null);
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
    setError('');
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await usuariosAPI.register(formData);
      
      if (response.requiresVerification) {
        setUserId(response.userId);
        setStep('2fa');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerification = async (code) => {
    const response = await usuariosAPI.verify2FA({ userId, codigo: code });

    if (response.token && response.user) {
      // Save session data
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("currentUser", JSON.stringify(response.user));

      // Show success and redirect
      alert('¡Cuenta creada y verificada exitosamente!');
      navigate("/");
    } else {
      throw new Error("Error en la verificación");
    }
  };

  const handleResend2FA = async () => {
    await usuariosAPI.resend2FA({ userId });
  };

  if (step === '2fa') {
    return (
      <TwoFactorVerification
        userId={userId}
        onSuccess={handle2FAVerification}
        onResend={handleResend2FA}
      />
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>
        <p className="subtitle">Únete a la comunidad de Arroyo Seco</p>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleRegistrationSubmit}>
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