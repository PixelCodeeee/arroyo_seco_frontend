import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme as useOldTheme } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeProvider";
import ConfirmModal from "./ConfirmModal";
import { getPendingOperations } from "../services/localDB";
import {
  Home,
  Store,
  Package,
  BellRing,
  Tag,
  ClipboardList,
  CalendarDays,
  Users,
  BarChart2,
  Megaphone,
  LogOut,
  Menu,
  X,
  Type,
  Settings,
} from "lucide-react";
import "../styles/Sidebar.css";

function FontSizeToggle({ collapsed }) {
  const { fontSize, cycleFontSize } = useOldTheme();
  const labels = { normal: "Normal", large: "Grande", xlarge: "Extra" };
  const nextLabel = { normal: "Grande", large: "Extra grande", xlarge: "Normal" };

  return (
    <button
      className="sidebar-fontsize-btn"
      onClick={cycleFontSize}
      title={`Tamaño ${labels[fontSize]} → click para ${nextLabel[fontSize]}`}
    >
      <span className="sidebar-fontsize-icon">
        <Type size={16} />
      </span>
      {!collapsed && (
        <span className="sidebar-fontsize-label">
          Texto: {labels[fontSize]}
          <span className="sidebar-fontsize-dots">
            <span className={fontSize === "normal" ? "sdot active" : "sdot"} />
            <span className={fontSize === "large" ? "sdot active" : "sdot"} />
            <span className={fontSize === "xlarge" ? "sdot active" : "sdot"} />
          </span>
        </span>
      )}
    </button>
  );
}

function Sidebar({ isCollapsed, onToggle, isOpen, onMobileToggle }) {
  const { isSettingsOpen, setIsSettingsOpen } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAdmin = currentUser?.rol === "admin";
  const isOferente = currentUser?.rol === "oferente";

  const [pendingCounts, setPendingCounts] = useState({
    ordenes: 0,
    reservas: 0,
    productos: 0
  });

  React.useEffect(() => {
    const checkPending = async () => {
      try {
        const ops = await getPendingOperations();
        setPendingCounts({
          ordenes: ops.filter(o => o.endpoint.includes('/pedidos') || o.endpoint.includes('/ordenes')).length,
          reservas: ops.filter(o => o.endpoint.includes('/reservas')).length,
          productos: ops.filter(o => o.endpoint.includes('/productos')).length,
        });
      } catch (err) {
        console.warn('Error reading pending operations', err);
      }
    };
    checkPending();
    const interval = setInterval(checkPending, 8000);
    window.addEventListener('dashboard-synced', checkPending);
    return () => {
      clearInterval(interval);
      window.removeEventListener('dashboard-synced', checkPending);
    };
  }, []);

  const requestLogout = () => {
    setConfirmLogout(true);
  };

  const executeLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const menuItems = [
    {
      id: "home",
      label: "Inicio",
      icon: <Home size={20} />,
      path: "/",
      roles: ["admin", "oferente", "turista"],
    },
    {
      id: "oferentes",
      label: isOferente ? "Mi Perfil" : "Oferentes",
      icon: <Store size={20} />,
      path: "/oferentes",
      roles: ["admin", "oferente"],
    },
    {
      id: "productos",
      label: "Productos",
      icon: <Package size={20} />,
      path: "/productos",
      roles: ["admin", "oferente"],
      badge: pendingCounts.productos > 0 ? pendingCounts.productos : null,
    },
    {
      id: "servicios",
      label: "Servicios",
      icon: <BellRing size={20} />,
      path: "/servicios",
      roles: ["admin", "oferente"],
    },
    {
      id: "categorias",
      label: "Categorías",
      icon: <Tag size={20} />,
      path: "/categorias",
      roles: ["admin", "oferente"], // unified — no duplicate needed
    },
    {
      id: "ordenes",
      label: "Órdenes",
      icon: <ClipboardList size={20} />,
      path: "/ordenes",
      roles: ["admin", "oferente", "turista"],
      badge: pendingCounts.ordenes > 0 ? pendingCounts.ordenes : null,
    },
    {
      id: "reservas",
      label: "Reservas",
      icon: <CalendarDays size={20} />,
      path: "/reservas",
      roles: ["admin", "oferente", "turista"],
      badge: pendingCounts.reservas > 0 ? pendingCounts.reservas : null,
    },
    {
      id: "divider-admin",
      type: "divider",
      roles: ["admin"],
    },
    {
      id: "usuarios",
      label: "Usuarios",
      icon: <Users size={20} />,
      path: "/usuarios",
      roles: ["admin"],
    },
    {
      id: "analiticas",
      label: "Analíticas",
      icon: <BarChart2 size={20} />,
      path: "/analiticas",
      roles: ["admin"],
    },
    {
      id: "divider-bottom",
      type: "divider",
      roles: ["admin", "oferente"],
    },
    {
      id: "anuncios",
      label: "Anuncios",
      icon: <Megaphone size={20} />,
      path: "/anuncios",
      roles: ["admin"],
    },
  ];

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
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* User Info */}
      {currentUser && (
        <Link 
          to="/perfil" 
          className="sidebar-user" 
          style={{ textDecoration: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", padding: "10px 20px" }}
        >
          <div className="user-avatar">
            {currentUser.nombre?.charAt(0).toUpperCase() || "?"}
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name">{currentUser.nombre}</div>
              <div className="user-role">
                {isAdmin ? "Administrador" : isOferente ? "Oferente" : "Turista"}
              </div>
            </div>
          )}
        </Link>
      )}

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {visibleMenuItems.map((item) => {
            if (item.type === "divider") {
              return (
                <li key={item.id} className="nav-divider">
                  {!isCollapsed && <hr />}
                </li>
              );
            }

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
        <FontSizeToggle collapsed={isCollapsed} />
        <button
          className="sidebar-settings-btn logout-button"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          title={isCollapsed ? "Cerrar Ajustes" : ""}
          style={{ marginBottom: '8px' }}
        >
          <span className="nav-icon"><Settings size={20} /></span>
          {!isCollapsed && <span>Ajustes Globales</span>}
        </button>
        <button
          className="logout-button"
          onClick={requestLogout}
          title={isCollapsed ? "Cerrar Sesión" : ""}
        >
          <span className="nav-icon"><LogOut size={20} /></span>
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>

      <ConfirmModal
        isOpen={confirmLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        onConfirm={executeLogout}
        onClose={() => setConfirmLogout(false)}
        confirmText="Cerrar sesión"
      />
    </aside>
  );
}

export default Sidebar;