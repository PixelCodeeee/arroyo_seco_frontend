import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <h3>Arroyo Seco</h3>
      <p>Descubre la riqueza cultural y gastronómica de nuestro pueblo</p>
      <p>super ultra new canary test version</p>

      <div className="footer-icons">
        <i className="fab fa-facebook-f"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-twitter"></i>
        <i className="fab fa-whatsapp"></i>
      </div>
      <div className="footer-links">
        <Link to="/privacidad">Privacidad</Link>
        <Link to="/terminos">Términos de Servicio</Link>
        <Link to="/eula">EULA</Link>
        <Link to="/equipo">Equipo</Link>
        <Link to="/faq">FAQ</Link>
      </div>

      <small>© 2026 Arroyo Seco. Todos los derechos reservados.</small>
    </footer>
  );
}

export default Footer;