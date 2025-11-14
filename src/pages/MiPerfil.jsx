import React, { useState, useEffect } from "react";
import { usuariosAPI } from "../services/api";
import "../styles/Auth.css";

function MiPerfil() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Fetch latest user data (optional but recommended)
      const user = await usuariosAPI.getById(currentUser.id_usuario);

      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        contrasena: "",
      });
    } catch (err) {
      setError(err.message || "Error al cargar tu perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        nombre: formData.nombre,
        correo: formData.correo,
      };

      // Only update password if provided
      if (formData.contrasena) {
        if (formData.contrasena.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres");
          setSaving(false);
          return;
        }
        updateData.contrasena = formData.contrasena;
      }

      // Update DB
      const updated = await usuariosAPI.update(currentUser.id_usuario, updateData);

      // Update local storage session
      localStorage.setItem("currentUser", JSON.stringify(updated));

      setSuccess("Tu perfil ha sido actualizado exitosamente.");
      setFormData({ ...formData, contrasena: "" });
    } catch (err) {
      setError(err.message || "Error al actualizar tu perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading">Cargando tu información...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Mi Perfil</h1>
        <p className="subtitle">Administra tu información personal</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Nueva Contraseña (opcional)</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <small className="form-hint">
              Solo llena este campo si deseas cambiar tu contraseña
            </small>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MiPerfil;
