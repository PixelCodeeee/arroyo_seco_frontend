import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LegalPages.css";
import FAQContent from "../content/legal/faq.md?raw";
import ReactMarkdown from "react-markdown";


function FAQ() {
  return (
    <div className="bg-primary text-primary">
      <Navbar />
      <div className="legal-page-container">
        <header className="legal-header">
          <h1>Preguntas Frecuentes (FAQ)</h1>
          <p>¿Cómo funciona Arroyo Seco?</p>
        </header>

        <div className="legal-content">
          <ReactMarkdown>{FAQContent}</ReactMarkdown>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FAQ;
