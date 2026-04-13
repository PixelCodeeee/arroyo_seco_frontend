import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LegalPages.css";

function EULA() {
  return (
    <div className="bg-primary text-primary">
      <Navbar />
      <div className="legal-page-container">
        <header className="legal-header">
          <h1>Acuerdo de Licencia de Usuario Final (EULA)</h1>
          <p>Última actualización: Abril 2026</p>
        </header>
        <div className="legal-content">
          <h2>1. Otorgamiento de Licencia</h2>
          <p>Te otorgamos una licencia limitada, no exclusiva, intransferible y revocable para utilizar el software y la plataforma de Arroyo Seco. (Texto dummy que será reemplazado por la estructura en Markdown).</p>
          
          <h2>2. Restricciones de Uso</h2>
          <p>Queda prohibido intentar alterar la infraestructura de microservicios, el código o la base de datos.</p>

          <h2>3. Derechos de Propiedad</h2>
          <p>El código y la marca registrada Arroyo Seco pertenecen a la institución y desarrolladores. Todos los derechos reservados.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EULA;
