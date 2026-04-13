import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LegalPages.css";
import termsOfServiceContent from "../content/legal/terminos_condiciones.md?raw";
import ReactMarkdown from "react-markdown";


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
          <ReactMarkdown>{termsOfServiceContent}</ReactMarkdown>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TermsOfService;
