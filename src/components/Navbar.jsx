// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); // ← Esto detecta en qué página estás

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

  const handleCartClick = () => {
    navigate("/carrito");
  };

  // Función para aplicar clase "active" si la ruta coincide
  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <nav className="nav-links">
        {/* ← NUEVO: Enlace a Home */}
        <Link 
          to="/" 
          className={isActive("/") ? "active" : ""}
        >
          Inicio
        </Link>

        <Link 
          to="/gastronomia" 
          className={isActive("/gastronomia") ? "active" : ""}
        >
          Gastronomía
        </Link>

        <Link 
          to="/artesanias" 
          className={isActive("/artesanias") ? "active" : ""}
        >
          Artesanías
        </Link>

        <Link 
          to="/contacto" 
          className={isActive("/contacto") ? "active" : ""}
        >
          Contacto
        </Link>

        {/* Paneles condicionales con active */}
        {user?.rol === "oferente" && (
          <Link 
            to="/panel-oferente" 
            className={`nav-role-btn ${isActive("/panel-oferente") ? "active" : ""}`}
          >
            Panel Oferente
          </Link>
        )}

        {user?.rol === "admin" && (
          <Link 
            to="/panel-admin" 
            className={`nav-role-btn ${isActive("/panel-admin") ? "active" : ""}`}
          >
            Panel Admin
          </Link>
        )}
      </nav>

      <div className="nav-icons">
        <button
          onClick={handleCartClick}
          className="cart-button"
          aria-label="Carrito de compras"
        >
          <i className="ri-shopping-cart-line"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {user ? (
          <>
            <Link 
              to="/perfil" 
              className={`perfil-link ${isActive("/perfil") ? "active" : ""}`}
            >
              Mi Perfil
            </Link>

            <button onClick={handleLogout} className="logout-btn">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`perfil-link ${isActive("/login") ? "active" : ""}`}
            >
              Iniciar sesión
            </Link>
            <Link 
              to="/register" 
              className={`perfil-link ${isActive("/register") ? "active" : ""}`}
            >
              Regístrate
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;