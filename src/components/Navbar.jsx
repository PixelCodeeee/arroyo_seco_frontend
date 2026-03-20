import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";
import "../styles/Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSettingsOpen, setIsSettingsOpen } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    updateCartCount();

    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [location]); // Re-run check on route change to keep user state fresh

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

  const handleCartClick = () => {
    navigate("/carrito");
  };

  const isActive = (path) => location.pathname === path;

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="navbar">
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      <nav className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
        <Link to="/" className={isActive("/") ? "active" : ""}>
          {t('nav.home', 'Inicio')}
        </Link>

        {/* Fixed: Added missing </Link> */}
        <Link to="/anuncios-publicos" className={isActive("/anuncios-publicos") ? "active" : ""}>
          {t('nav.events', 'Eventos')}
        </Link>

        <Link to="/gastronomia" className={isActive("/gastronomia") ? "active" : ""}>
          {t('nav.gastronomy', 'Gastronomía')}
        </Link>

        <Link to="/artesanias" className={isActive("/artesanias") ? "active" : ""}>
          {t('nav.handicrafts', 'Artesanías')}
        </Link>

        {/* Fixed: Added missing </Link> */}
        <Link to="/recomendaciones" className={isActive("/recomendaciones") ? "active" : ""}>
          {t('nav.recommendations', 'Recomendaciones')}
        </Link>

        <Link to="/contacto" className={isActive("/contacto") ? "active" : ""}>
          {t('nav.contact', 'Contacto')}
        </Link>

        {user?.rol === "oferente" && (
          <Link to="/panel-oferente" className={`nav-role-btn ${isActive("/panel-oferente") ? "active" : ""}`}>
            {t('nav.oferente_panel', 'Panel Oferente')}
          </Link>
        )}

        {user?.rol === "admin" && (
          /* Fixed: Removed nested/duplicate Link logic here */
          <Link to="/panel-admin" className={`nav-role-btn ${isActive("/panel-admin") ? "active" : ""}`}>
            {t('nav.admin_panel', 'Panel Admin')}
          </Link>
        )}
      </nav>

      <div className="nav-icons">

        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="cart-button" aria-label="Ajustes">
          <i className="ri-settings-3-line"></i>
        </button>

        <button onClick={handleCartClick} className="cart-button" aria-label="Carrito de compras">
          <i className="ri-shopping-cart-line"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {user ? (
          <div className="user-controls">
            <Link to="/perfil" className={`perfil-link ${isActive("/perfil") ? "active" : ""}`}>
              {t('nav.profile', 'Mi Perfil')}
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              {t('nav.logout', 'Cerrar sesión')}
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className={`btn-login ${isActive("/login") ? "active" : ""}`}>
              {t('nav.login', 'Iniciar sesión')}
            </Link>
            <Link to="/register" className={`btn-register ${isActive("/register") ? "active" : ""}`}>
              {t('nav.register', 'Regístrate')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;