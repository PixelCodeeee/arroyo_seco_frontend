// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showLang, setShowLang] = useState(false);
  const [showContrast, setShowContrast] = useState(false);
  const [contrast, setContrast] = useState(100);
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

  const handleCartClick = () => navigate("/carrito");
  const isActive = (path) => location.pathname === path;

  const handleLangChange = (lang) => {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
    }
    setShowLang(false);
  };

  const handleContrastChange = (val) => {
    setContrast(val);
    document.body.style.filter = `contrast(${val}%)`;
  };

  return (
    <header className="navbar">
      <nav className="nav-links">
        <Link to="/" className={isActive("/") ? "active" : ""}>Inicio</Link>
        <Link to="/gastronomia" className={isActive("/gastronomia") ? "active" : ""}>Gastronomía</Link>
        <Link to="/artesanias" className={isActive("/artesanias") ? "active" : ""}>Artesanías</Link>
        <Link to="/anuncios-publicos" className={isActive("/anuncios-publicos") ? "active" : ""}>Eventos</Link>
        <Link to="/contacto" className={isActive("/contacto") ? "active" : ""}>Contacto</Link>

        {user?.rol === "oferente" && (
          <Link to="/panel-oferente" className={`nav-role-btn ${isActive("/panel-oferente") ? "active" : ""}`}>
            Panel Oferente
          </Link>
        )}
        {user?.rol === "admin" && (
          <Link to="/panel-admin" className={`nav-role-btn ${isActive("/panel-admin") ? "active" : ""}`}>
            Panel Admin
          </Link>
        )}
      </nav>

      <div className="nav-icons">
        <button onClick={handleCartClick} className="cart-button" aria-label="Carrito de compras">
          <i className="ri-shopping-cart-line"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {user ? (
          <>
            <Link to="/perfil" className={`perfil-link ${isActive("/perfil") ? "active" : ""}`}>
              Mi Perfil
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`perfil-link ${isActive("/login") ? "active" : ""}`}>
              Iniciar sesión
            </Link>
            <Link to="/register" className={`perfil-link ${isActive("/register") ? "active" : ""}`}>
              Regístrate
            </Link>
          </>
        )}

        {/* Contraste */}
        <div className="lang-wrapper">
          <button className="lang-btn" onClick={() => { setShowContrast(!showContrast); setShowLang(false); }}>
            🔆
          </button>
          {showContrast && (
            <div className="lang-dropdown contrast-panel">
              <p>Contraste</p>
              <input
                type="range"
                min="100"
                max="200"
                value={contrast}
                onChange={(e) => handleContrastChange(e.target.value)}
              />
              <span>{contrast}%</span>
              <button className="reset-contrast" onClick={() => handleContrastChange(100)}>
                Resetear
              </button>
            </div>
          )}
        </div>

        {/* Idioma */}
        <div className="lang-wrapper">
          <button className="lang-btn" onClick={() => { setShowLang(!showLang); setShowContrast(false); }}>
            Idioma
          </button>
          {showLang && (
            <div className="lang-dropdown">
              <div onClick={() => handleLangChange('es')}>🇲🇽 Español</div>
              <div onClick={() => handleLangChange('en')}>🇺🇸 English</div>
              <div onClick={() => handleLangChange('fr')}>🇫🇷 Français</div>
              <div onClick={() => handleLangChange('de')}>🇩🇪 Deutsch</div>
              <div onClick={() => handleLangChange('pt')}>🇧🇷 Português</div>
              <div onClick={() => handleLangChange('ja')}>🇯🇵 日本語</div>
              <div onClick={() => handleLangChange('ru')}>🇷🇺 Русский</div>
              <div onClick={() => handleLangChange('ar')}>🇸🇦 العربية</div>
              <div onClick={() => handleLangChange('it')}>🇮🇹 Italiano</div>
              <div onClick={() => handleLangChange('zh-CN')}>🇨🇳 中文</div>
            </div>
          )}
          <div id="google_translate_element" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: 0 }}></div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;