// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Load session + cart
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

  return (
    <header className="navbar">
      <nav className="nav-links">
        <Link to="/gastronomia">Gastronomía</Link>
        <Link to="/artesanias">Artesanías</Link>
        <Link to="/contacto">Contacto</Link>

        {/* === ROLE-BASED OPTIONS === */}
        {user?.rol === "oferente" && (
          <Link to="/panel-oferente" className="nav-role-btn">
            Panel Oferente
          </Link>
        )}

        {user?.rol === "administrador" && (
          <Link to="/admin" className="nav-role-btn">
            Panel Admin
          </Link>
        )}
      </nav>

      <div className="nav-icons">
        {/* Cart button */}
        <button
          onClick={handleCartClick}
          className="cart-button"
          aria-label="Carrito de compras"
          style={{ fontSize: "1.5rem" }}
        >
          <i className="ri-shopping-cart-line"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {/* Session options */}
        {user ? (
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
