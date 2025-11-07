// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Check for session and cart items
  useEffect(() => {
    const session = sessionStorage.getItem("userSession"); // adjust key if needed
    setIsLoggedIn(!!session);
    
    // Get cart count from memory or state management
    updateCartCount();

    // Escuchar evento de actualización del carrito
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateCartCount = () => {
    // This should connect to your cart state management
    // For now, using a simple counter as example
    const cartItems = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
    setCartCount(cartItems.length);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userSession");
    setIsLoggedIn(false);
    navigate("/"); // redirect to home or login
  };

  const handleCartClick = () => {
    navigate("/carrito");
  };

  return (
    <header className="navbar">
      <nav className="nav-links">
        <Link to="/gastronomia">Gastronomía</Link>
        <Link to="/artesanias">Artesanías</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>

      <div className="nav-icons">
        <button 
          onClick={handleCartClick} 
          className="cart-button"
          aria-label="Carrito de compras"
          style={{ fontSize: '1.5rem' }}
        >
          <i className="ri-shopping-cart-line"></i>
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>

        {isLoggedIn ? (
          <>
            <Link to="/perfil" className="perfil-link">
              Mi Perfil
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="perfil-link">
              Iniciar sesión
            </Link>
            <Link to="/register" className="perfil-link">
              Regístrate
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;