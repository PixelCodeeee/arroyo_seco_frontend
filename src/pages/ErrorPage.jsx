import React from "react";
import { useLocation, Link } from "react-router-dom";
import "../styles/ErrorPage.css";

function ErrorPage() {
  const location = useLocation();

  // Default error data assumes 404 unless routed via custom throw
  const error = location.state?.error || {
    title: "404 - Página no encontrada",
    message: "La URL que intentaste visitar no existe, fue movida o no tienes autorización.",
    code: "404"
  };

  return (
    <div className="error-page">
      <h1>{error.code}</h1>
      <h2>{error.title}</h2>
      <p>{error.message}</p>

      <Link to="/" className="error-btn">
        Volver al inicio
      </Link>
    </div>
  );
}

export default ErrorPage;
