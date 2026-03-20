import React from "react";
import { useLocation, Link } from "react-router-dom";
import "../styles/ErrorPage.css";

function ErrorPage() {
  const location = useLocation();

  // Default error data
  const error = location.state?.error || {
    title: "Oops!",
    message: "Something went wrong.",
    code: "ERROR"
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
