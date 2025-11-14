import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <h3>Arroyo Seco</h3>
      <p>Descubre la riqueza cultural y gastronómica de nuestro pueblo</p>
      
      <div className="footer-icons">
        <i className="fab fa-facebook-f"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-twitter"></i>
        <i className="fab fa-whatsapp"></i>
      </div>
      
      <small>© 2025 Arroyo Seco. Todos los derechos reservados.</small>
    </footer>
  );
}

export default Footer;