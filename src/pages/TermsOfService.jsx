import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LegalPages.css";

function TermsOfService() {
  return (
    <div className="bg-primary text-primary">
      <Navbar />
      <div className="legal-page-container">
        <header className="legal-header">
          <h1>Términos de Servicio</h1>
          <p>Última actualización: Abril 2026</p>
        </header>
        <div className="legal-content">
          <h2>1. Introducción</h2>
          <p>Bienvenido a Arroyo Seco. Estos términos de servicio rigen el uso general de nuestra plataforma. (Texto dummy que será reemplazado por la estructura en Markdown).</p>
          
          <h2>2. Uso de la Plataforma</h2>
          <p>El uso está restringido a usuarios registrados. Al continuar usando la plataforma, aceptas estos términos provisionales.</p>

          <h2>3. Obligaciones y Responsabilidades</h2>
          <p>Tanto turistas como oferentes tienen responsabilidades respecto a las reservas y compras.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TermsOfService;
