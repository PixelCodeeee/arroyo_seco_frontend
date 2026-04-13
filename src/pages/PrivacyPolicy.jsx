import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LegalPages.css";

function PrivacyPolicy() {
  return (
    <div className="bg-primary text-primary">
      <Navbar />
      <div className="legal-page-container">
        <header className="legal-header">
          <h1>Política de Privacidad</h1>
          <p>Última actualización: Abril 2026</p>
        </header>
        <div className="legal-content">
          <h2>1. Recopilación de Datos</h2>
          <p>En Arroyo Seco nos tomamos muy en serio tu privacidad. (Texto dummy que será reemplazado por la estructura en Markdown).</p>
          
          <h2>2. Uso de tu Información</h2>
          <p>Utilizamos tus datos de contacto y facturación (MercadoPago) para gestionar pedidos y reservaciones con los oferentes.</p>

          <h2>3. Compartición de Datos</h2>
          <p>Tus datos son expuestos a los restaurantes y artesanos únicamente como parte del flujo de compra y reservas.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
