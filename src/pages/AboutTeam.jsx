import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LegalPages.css";

function AboutTeam() {
  return (
    <div className="bg-primary text-primary">
      <Navbar />
      <div className="legal-page-container">
        <header className="legal-header">
          <h1>Sobre el Equipo de Desarrollo</h1>
          <p>Conoce a quienes dieron vida a la plataforma de Arroyo Seco</p>
        </header>
        <div className="legal-content">
          <h2>Nuestro Propósito</h2>
          <p>Esta plataforma fue desarrollada con el objetivo de reactivar la economía y digitalizar los negocios gastronómicos y artesanales de la zona de Arroyo Seco.</p>
          
          <h2>El Equipo</h2>
          <p>Somos un grupo de ingenieros y diseñadores comprometidos con el desarrollo tecnológico de México. (Texto dummy que será reemplazado por la estructura en Markdown).</p>

          <h2>Agradecimientos</h2>
          <p>Agradecemos a todos los oferentes locales y autoridades por su participación e interés estructurando este enorme cambio local.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutTeam;
