// src/components/MiPerfil.jsx - VERSIÓN CORREGIDA

import React, { useState, useEffect } from "react";
import { usuariosAPI } from "../services/api";
import "../styles/MiPerfil.css";
import MisResenas from "../pages/reviews/MisResenas";

function MiPerfil() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userFromStorage, setUserFromStorage] = useState(null); // 👈 NUEVO

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    // 👇 Obtener usuario del localStorage PRIMERO
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserFromStorage(parsedUser);
      console.log('👤 Usuario desde localStorage:', parsedUser);
    }

    const fetchUser = async () => {
      try {
        const response = await usuariosAPI.getPerfil();
        setFormData(response);
        setUser(response);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usuariosAPI.actualizarPerfil(formData);
      alert("Perfil actualizado correctamente");
    } catch {
      alert("Error al actualizar perfil");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  if (loading) return <div className="loading">Cargando...</div>;

  // 👇 Usar userFromStorage como respaldo si user es null
  const currentUser = user || userFromStorage;
  console.log('🎯 Usuario actual para renderizar:', currentUser);

  return (
    <div className="perfil-container">

      {/* Sidebar Desktop */}
      <aside className="sidebar-desktop">
        <div
          className={`sidebar-item ${activeTab === "perfil" ? "active" : ""}`}
          onClick={() => setActiveTab("perfil")}
        >👤 Mi Perfil</div>
        
        <div
          className={`sidebar-item ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >🔒 Contraseña</div>
        
        {/* 👇 Solo para turistas - AHORA CON DEBUG */}
        {currentUser?.rol === 'turista' && (
          <div
            className={`sidebar-item ${activeTab === "mis-resenas" ? "active" : ""}`}
            onClick={() => setActiveTab("mis-resenas")}
          >⭐ Mis Reseñas</div>
        )}
        
        {/* 👇 Solo para oferentes */}
        {currentUser?.rol === 'oferente' && (
          <div
            className={`sidebar-item ${activeTab === "resenas-negocio" ? "active" : ""}`}
            onClick={() => setActiveTab("resenas-negocio")}
          >🏪 Reseñas de mi Negocio</div>
        )}
        
        {(user?.rol === 'oferente' || user?.rol === 'admin') && (
    <div
        className={`sidebar-item ${activeTab === "mis-reportes" ? "active" : ""}`}
        onClick={() => setActiveTab("mis-reportes")}
    >
        🚩 Mis Reportes
    </div>
)}
        
        <div
          className={`sidebar-item ${activeTab === "notificaciones" ? "active" : ""}`}
          onClick={() => setActiveTab("notificaciones")}
        >🔔 Notificaciones</div>
        
        <div
          className={`sidebar-item ${activeTab === "verificacion" ? "active" : ""}`}
          onClick={() => setActiveTab("verificacion")}
        >✅ Verificación</div>

        <div className="sidebar-divider"></div>
        <div className="sidebar-item logout" onClick={handleLogout}>
          🚪 Cerrar Sesión
        </div>
      </aside>

      {/* Mobile Tabs */}
      <div className="tabs-mobile">
        <button
          className={activeTab === "perfil" ? "tab active" : "tab"}
          onClick={() => setActiveTab("perfil")}
        >Perfil</button>
        
        {/* 👇 Mobile tabs actualizados */}
        {currentUser?.rol === 'turista' && (
          <button
            className={activeTab === "mis-resenas" ? "tab active" : "tab"}
            onClick={() => setActiveTab("mis-resenas")}
          >Mis Reseñas</button>
        )}
        
        {currentUser?.rol === 'oferente' && (
          <button
            className={activeTab === "resenas-negocio" ? "tab active" : "tab"}
            onClick={() => setActiveTab("resenas-negocio")}
          >Reseñas</button>
        )}
        
        <button
          className={activeTab === "mis-reportes" ? "tab active" : "tab"}
          onClick={() => setActiveTab("mis-reportes")}
        >Reportes</button>
        
        <button
          className={activeTab === "password" ? "tab active" : "tab"}
          onClick={() => setActiveTab("password")}
        >Contraseña</button>
      </div>

      {/* Main Content */}
      <div className="perfil-content">

        {/* Perfil Tab */}
        {activeTab === "perfil" && (
          <div className="card">
            <h2>Mi Información</h2>

            <div className="avatar-section">
              <div className="avatar-circle">
                {avatar ? (
                  <img src={avatar} alt="avatar" />
                ) : (
                  <span>{formData.nombre?.[0] || 'U'}</span>
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
                  value={formData.nombre || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion || ''}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn-primary save-btn">
                Guardar Cambios
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="card">
            <h2>Cambiar Contraseña</h2>
            <p className="coming">(Aquí puedes agregar el formulario de contraseña)</p>
          </div>
        )}

        {/* Mis Reseñas */}
        {activeTab === "mis-resenas" && (
          <div className="card">
            <h2>⭐ Mis Reseñas</h2>
            <MisResenas />
          </div>
        )}

        {/* Reseñas del Negocio */}
        {activeTab === "resenas-negocio" && (
          <div className="card">
            <h2>🏪 Reseñas de mi Negocio</h2>
            <p className="coming">(Próximamente: reseñas de tu negocio)</p>
          </div>
        )}

        {/* Mis Reportes */}
        {activeTab === "mis-reportes" && (
          <div className="card">
            <h2>🚩 Mis Reportes</h2>
            <p className="coming">(Próximamente: historial de tus reportes)</p>
          </div>
        )}

        {/* Notificaciones */}
        {activeTab === "notificaciones" && (
          <div className="card">
            <h2>🔔 Notificaciones</h2>
            <p className="coming">(Configuraciones de alertas y notificaciones)</p>
          </div>
        )}

        {/* Verificación */}
        {activeTab === "verificacion" && (
          <div className="card">
            <h2>✅ Verificación de Cuenta</h2>
            <p className="coming">(Estado y proceso de verificación)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MiPerfil;