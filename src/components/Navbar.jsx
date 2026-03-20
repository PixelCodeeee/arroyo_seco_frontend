// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, fontSize, cycleFontSize } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) setUser(JSON.parse(storedUser));
    updateCartCount();
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const updateCartCount = () => {
    const cartItems = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
    setCartCount(cartItems.length);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("cartItems");
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const fontSizeTitle = {
    normal: "Tamaño normal — click para grande",
    large:  "Tamaño grande — click para extra grande",
    xlarge: "Tamaño extra grande — click para normal",
  };

  const fontSizeStyle = {
    normal: { fontSize: "0.85rem" },
    large:  { fontSize: "1rem" },
    xlarge: { fontSize: "1.2rem" },
  };

  return (
    <header className="navbar">
      <nav className="nav-links">
        <Link to="/" className={isActive("/") ? "active" : ""}>Inicio</Link>
        <Link to="/gastronomia" className={isActive("/gastronomia") ? "active" : ""}>Gastronomía</Link>
        <Link to="/artesanias" className={isActive("/artesanias") ? "active" : ""}>Artesanías</Link>
        <Link to="/recomendaciones" className={isActive("/recomendaciones") ? "active" : ""}>Recomendaciones</Link>
        <Link to="/contacto" className={isActive("/contacto") ? "active" : ""}>Contacto</Link>

        {user?.rol === "oferente" && (
          <Link to="/panel-oferente" className={`nav-role-btn ${isActive("/panel-oferente") ? "active" : ""}`}>
            Panel Oferente
          </Link>
        )}
        {user?.rol === "admin" && (
          <Link to="/analiticas" className={`nav-role-btn ${isActive("/panel-admin") ? "active" : ""}`}>
            Panel Admin
          </Link>
        )}
      </nav>

      <div className="nav-icons">
        {/* Toggle tamaño de fuente */}
        <button
          onClick={cycleFontSize}
          className="font-size-btn"
          aria-label="Cambiar tamaño de letra"
          title={fontSizeTitle[fontSize]}
        >
          <span style={fontSizeStyle[fontSize]} className="font-size-indicator">
            A
          </span>
          <span className="font-size-dots">
            <span className={fontSize === "normal" ? "dot active" : "dot"} />
            <span className={fontSize === "large"  ? "dot active" : "dot"} />
            <span className={fontSize === "xlarge" ? "dot active" : "dot"} />
          </span>
        </button>

        {/* Toggle tema */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Cambiar tema"
          title={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
        >
          {theme === "dark" ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1"  x2="12" y2="3"  />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"  />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1"  y1="12" x2="3"  y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Carrito */}
        <button onClick={() => navigate("/carrito")} className="cart-button" aria-label="Carrito">
          <i className="ri-shopping-cart-line"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {user ? (
          <>
            <Link to="/perfil" className={`perfil-link ${isActive("/perfil") ? "active" : ""}`}>Mi Perfil</Link>
            <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login"    className={`perfil-link ${isActive("/login")    ? "active" : ""}`}>Iniciar sesión</Link>
            <Link to="/register" className={`perfil-link ${isActive("/register") ? "active" : ""}`}>Regístrate</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;