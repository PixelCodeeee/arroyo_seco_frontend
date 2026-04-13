import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LegalPages.css";
import eulaContent from "../content/legal/eula.md?raw";

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
          <ReactMarkdown>{eulaContent}</ReactMarkdown>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EULA;