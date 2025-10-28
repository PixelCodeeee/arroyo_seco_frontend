import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuariosAPI } from "../services/api";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send login request to backend API
      const response = await usuariosAPI.login(formData);

      if (!response || !response.user || !response.token) {
        throw new Error("Credenciales inválidas o respuesta del servidor incorrecta");
      }

      // Save session data
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("currentUser", JSON.stringify(response.user));

      // Redirect to homepage
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>
        <p className="subtitle">Bienvenido a Arroyo Seco</p>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
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
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
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
