import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Truck } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";
import { pedidosAPI } from "../services/api";
import { toast } from "sonner";
import OrdenDetailModal from "./OrdenDetailModal";
import "../styles/Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSettingsOpen, setIsSettingsOpen } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Global Tracker State
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerPedido, setTrackerPedido] = useState(null);
  const [isTrackerLoading, setIsTrackerLoading] = useState(false);

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

  const handleCartClick = () => navigate("/carrito");
  const isActive = (path) => location.pathname === path;

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleTrackerClick = async () => {
    if (!user) return;
    try {
      setIsTrackerLoading(true);
      const response = await pedidosAPI.getMisPedidos();
      const orders = response.pedidos || [];  // ✅ extraer el array

      if (orders.length === 0) {
        toast.info("No tienes órdenes recientes.");
        return;
      }

      const sortedOrders = orders.sort((a, b) =>
        new Date(b.fecha_pedido) - new Date(a.fecha_pedido)  // ✅ campo correcto
      );
      const activeOrder = sortedOrders.find(o => o.estado !== "completado") || sortedOrders[0];

      // Fetch full detail con items
      const detalle = await pedidosAPI.getById(activeOrder.id_pedido);
      setTrackerPedido(detalle);
      setIsTrackerOpen(true);
    } catch (err) {
      toast.error("No se pudo cargar el rastreador de órdenes");
    } finally {
      setIsTrackerLoading(false);
    }
  };

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
        {user?.rol === "moderador" && (
  <Link to="/panel-moderador" className={`nav-role-btn ${isActive("/panel-moderador") ? "active" : ""}`}>
    {t('nav.moderador_panel', 'Panel Moderador')}
  </Link>
)}
      </nav>

      <div className="nav-icons">

        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="cart-button" aria-label="Ajustes">
          <i className="ri-settings-3-line"></i>
        </button>

        {user && (
          <button
            onClick={handleTrackerClick}
            className="cart-button"
            aria-label="Rastreador de Órdenes"
            disabled={isTrackerLoading}
          >
            {isTrackerLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <Truck size={20} />}
          </button>
        )}

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

        {/* Google Translate Element (hidden) */}
        <div id="google_translate_element" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: 0 }}></div>

      </div>

      {/* Global Tracker Modal Injection */}
      <OrdenDetailModal
        pedido={trackerPedido}
        isOpen={isTrackerOpen}
        onClose={() => {
          setIsTrackerOpen(false);
          setTrackerPedido(null);
        }}
        onEstadoChange={() => { }}
        canChangeEstado={false}
        isTurista={user?.rol === "turista" || user?.rol === "oferente"}
      />
    </header>
  );
}

export default Navbar;