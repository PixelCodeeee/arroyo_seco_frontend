import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RequireRole({ allowed = [], children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const role = user.rol;

  if (!allowed.includes(role)) {
    return (
      <Navigate
        to="/error"
        replace
        state={{
          error: {
            code: "403",
            title: "Acceso denegado",
            message: `Tu rol (${role}) no tiene permisos para acceder a esta sección.`
          }
        }}
      />
    );
  }

  return children;
}

export default RequireRole;
