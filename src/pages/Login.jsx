import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuariosAPI } from "../services/api";
import TwoFactorVerification from "../components/TwoFactorVerification";
import "../styles/auth.css";
import { Eye, EyeOff } from "lucide-react";


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

  const [showPassword, setShowPassword] = useState(false);


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
      localStorage.setItem("token", response.token);
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
  <div style={{ position: "relative" }}>
    <input
      type={showPassword ? "text" : "password"}
      id="contrasena"
      name="contrasena"
      placeholder="••••••••"
      value={formData.contrasena}
      onChange={handleChange}
      required
      style={{ paddingRight: "2.5rem", width: "100%" }}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: "0.75rem",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-muted)",
        display: "flex",
        alignItems: "center",
        padding: 0,
      }}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Continuar"}
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p>
            <Link to="/recuperar-password" className="link" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
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