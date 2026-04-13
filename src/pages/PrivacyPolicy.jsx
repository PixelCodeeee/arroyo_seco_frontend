import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LegalPages.css";
import privacyPolicyContent from "../content/legal/politica_privacidad.md?raw";
import ReactMarkdown from "react-markdown";


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
          <ReactMarkdown>{privacyPolicyContent}</ReactMarkdown>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
