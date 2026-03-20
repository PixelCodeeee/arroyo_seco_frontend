import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar({ isCollapsed, onToggle, isOpen, onMobileToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAdmin = currentUser?.rol === "admin";
  const isOferente = currentUser?.rol === "oferente";

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Helper to check if route is active
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // Menu items configuration
  // Menu items configuration
  const menuItems = [
    {
      id: "home",
      label: "Inicio",
      icon: "🏠",
      path: "/",
      roles: ["admin", "oferente", "turista"],
    },
    {
      id: "oferentes",
      label: isOferente ? "Mi Perfil" : "Oferentes",
      icon: "🏪",
      path: "/oferentes",
      roles: ["admin", "oferente"],
    },
    {
      id: "productos",
      label: "Productos",
      icon: "📦",
      path: "/productos",
      roles: ["admin", "oferente"],
    },
    {
      id: "servicios",
      label: "Servicios",
      icon: "🛎️",
      path: "/servicios",
      roles: ["admin", "oferente"],
    },
    {
      id: "categorias",
      label: "Categorías",
      icon: "🏷️",
      path: "/categorias",
      roles: ["oferente", "admin"],
    },
    {
      id: "ordenes",
      label: "Órdenes",
      icon: "📋",
      path: "/ordenes",
      roles: ["admin", "oferente"],
    },
    {
      id: "reservas",
      label: "Reservas",
      icon: "📅",
      path: "/reservas",
      roles: ["admin", "oferente"],
    },
    {
      id: "divider-1",
      type: "divider",
      roles: ["admin"],
    },
    {
      id: "usuarios",
      label: "Usuarios",
      icon: "👥",
      path: "/usuarios",
      roles: ["admin"],
      badge: "Admin",
    },
    {
      id: "analiticas",
      label: "Analíticas",
      icon: "📊",
      path: "/analiticas",
      roles: ["admin", "oferente"],
      badge: "Nuevo",
    },
    {
      id: "categorias",
      label: "Categorías",
      icon: "🏷️",
      path: "/categorias",
      roles: ["admin"],
    },
    {
      id: "divider-2",
      type: "divider",
      roles: ["admin", "oferente"],
    },
    {
  id: 'anuncios',
  label: 'Anuncios',
  icon: '📢',
  path: '/anuncios',
  roles: ['admin', 'oferente']
},
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser?.rol);
  });

  return (
    <aside
      className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isOpen ? "open" : ""}`}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!isCollapsed && <span className="logo-text">Panel de control</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          title={isCollapsed ? "Expandir" : "Colapsar"}
        >
          {isCollapsed ? "☰" : "✕"}
        </button>
      </div>

      {/* User Info */}
      {currentUser && (
        <div className="sidebar-user">
          <div className="user-avatar">
            {currentUser.nombre?.charAt(0).toUpperCase() || "?"}
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name">{currentUser.nombre}</div>
              <div className="user-role">
                {isAdmin ? "👑 Administrador" : "🏪 Oferente"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {visibleMenuItems.map((item) => {
            // Render divider
            if (item.type === "divider") {
              return (
                <li key={item.id} className="nav-divider">
                  {!isCollapsed && <hr />}
                </li>
              );
            }

            // Render menu item
            return (
              <li key={item.id} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                  title={isCollapsed ? item.label : ""}
                  onClick={onMobileToggle}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button
          className="logout-button"
          onClick={handleLogout}
          title={isCollapsed ? "Cerrar Sesión" : ""}
        >
          <span className="nav-icon">🚪</span>
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
