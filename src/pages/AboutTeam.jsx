import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LegalPages.css";
import aboutTeamContent from "../content/legal/equipo_desarrollo.md?raw";
import ReactMarkdown from "react-markdown";


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
          <ReactMarkdown>{aboutTeamContent}</ReactMarkdown>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutTeam;
