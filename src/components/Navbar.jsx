// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check localStorage for session
  useEffect(() => {
    const session = localStorage.getItem("userSession"); // adjust key if needed
    setIsLoggedIn(!!session);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    setIsLoggedIn(false);
    navigate("/"); // redirect to home or login
  };

  return (
    <header className="navbar">
      <nav className="nav-links">
        <Link to="/gastronomia">Gastronomía</Link>
        <Link to="/artesanias">Artesanías</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>

      <div className="nav-icons">
        <i className="ri-shopping-cart-line"></i>

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
