
// src/components/MiPerfil.jsx
import React, { useState, useEffect } from "react";
import { usuariosAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import "../styles/MiPerfil.css";

function MiPerfil() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");
  const [avatar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
  });

  const [passwordData, setPasswordData] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await usuariosAPI.getPerfil();
        setFormData(response);
      } catch {
        console.error("Error loading user profile");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usuariosAPI.actualizarPerfil(formData);
      toast.success("Perfil actualizado correctamente");
    } catch {
      toast.error("Error al actualizar perfil");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.nuevaContrasena !== passwordData.confirmarContrasena) {
      return toast.error("Las contraseñas no coinciden");
    }
    
    try {
      await usuariosAPI.updatePassword(user.id_usuario, {
         contrasenaActual: passwordData.contrasenaActual,
         nuevaContrasena: passwordData.nuevaContrasena
      });
      toast.success("Contraseña actualizada correctamente");
      setPasswordData({ contrasenaActual: "", nuevaContrasena: "", confirmarContrasena: "" });
    } catch (err) {
      toast.error(err.message || "Error al actualizar contraseña");
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="perfil-container">

      {/* Sidebar Desktop */}
      <aside className="sidebar-desktop">
        <div
          className={`sidebar-item ${activeTab === "perfil" ? "active" : ""}`}
          onClick={() => setActiveTab("perfil")}
        >Mi Perfil</div>
        <div
          className={`sidebar-item ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >Contraseña</div>
        <div
          className={`sidebar-item ${activeTab === "notificaciones" ? "active" : ""}`}
          onClick={() => setActiveTab("notificaciones")}
        >Notificaciones</div>
        <div
          className={`sidebar-item ${activeTab === "verificacion" ? "active" : ""}`}
          onClick={() => setActiveTab("verificacion")}
        >Verificación</div>
      </aside>

      {/* Main Content */}
      <div className="perfil-content">

        {/* Mobile Tabs */}
        <div className="tabs-mobile">
          <button
            className={activeTab === "perfil" ? "tab active" : "tab"}
            onClick={() => setActiveTab("perfil")}
          >Perfil</button>
          <button
            className={activeTab === "password" ? "tab active" : "tab"}
            onClick={() => setActiveTab("password")}
          >Contraseña</button>
          <button
            className={activeTab === "notificaciones" ? "tab active" : "tab"}
            onClick={() => setActiveTab("notificaciones")}
          >Alertas</button>
          <button
            className={activeTab === "verificacion" ? "tab active" : "tab"}
            onClick={() => setActiveTab("verificacion")}
          >Verificación</button>
        </div>

        {/* Perfil Tab */}
        {activeTab === "perfil" && (
          <div className="card">
            <h2>Mi Información</h2>

            <div className="avatar-section">
              <div className="avatar-circle">
                {avatar ? (
                  <img src={avatar} alt="avatar" />
                ) : (
                  <span>{formData.nombre[0]}</span>
                )}
              </div>

              <div className="avatar-buttons">
                <button className="btn-primary">Subir Avatar</button>
                <button className="btn-outline">Eliminar</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="perfil-form">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>

              {user?.rol === "oferente" && (
                <>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono || ""}
                      onChange={handleChange}
                    />
                  </div>
    
                  <div className="form-group">
                    <label>Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion || ""}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <button className="btn-primary save-btn">Guardar Cambios</button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="card">
            <h2>Cambiar Contraseña</h2>
            <form className="perfil-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Contraseña Actual</label>
                <input
                  type="password"
                  name="contrasenaActual"
                  value={passwordData.contrasenaActual}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  name="nuevaContrasena"
                  value={passwordData.nuevaContrasena}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  name="confirmarContrasena"
                  value={passwordData.confirmarContrasena}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <button type="submit" className="btn-primary save-btn">
                Actualizar Contraseña
              </button>
            </form>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notificaciones" && (
          <div className="card">
            <h2>Notificaciones</h2>
            <p className="coming">(Configuraciones de alertas y notificaciones)</p>
          </div>
        )}

        {/* Verification */}
        {activeTab === "verificacion" && (
          <div className="card">
            <h2>Verificación de Cuenta</h2>
            <p className="coming">(Estado y proceso de verificación)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MiPerfil;
