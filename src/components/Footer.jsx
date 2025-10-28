// src/components/Footer.jsx
import React from "react";
import "../styles/Home.css"; // o su propio Footer.css si prefieres separarlo

function Footer() {
  return (
    <footer className="footer">
      <h3>Explora Arroyo Seco</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur
        adipiscing elit quisque faucibus.
      </p>
      <div className="footer-icons">
        <i className="ri-facebook-fill"></i>
        <i className="ri-instagram-line"></i>
        <i className="ri-twitter-fill"></i>
      </div>
      <small>© 2025 UTEQ Ltd. All Rights Reserved.</small>
    </footer>
  );
}

export default Footer;
