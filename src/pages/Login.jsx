import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuariosAPI } from "../services/api";
import TwoFactorVerification from "../components/TwoFactorVerification";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState('credentials'); // 'credentials' or '2fa'
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await usuariosAPI.login(formData);

      if (response.requiresVerification) {
        setUserId(response.userId);
        setStep('2fa');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Error al iniciar sesión");
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

      // Redirect to homepage
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
        <h1>Iniciar Sesión</h1>
        <p className="subtitle">Bienvenido a Arroyo Seco</p>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleCredentialsSubmit}>
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
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Continuar"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;