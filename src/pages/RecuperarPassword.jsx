import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuariosAPI } from "../services/api";
import { toast } from "sonner";
import "../styles/auth.css"; // Reuse auth styles

function RecuperarPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [correo, setCorreo] = useState("");
  
  const [resetData, setResetData] = useState({
    codigo: "",
    nuevaContrasena: "",
    confirmarContrasena: ""
  });

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usuariosAPI.forgotPassword({ correo });
      toast.success("Si el correo existe, el código fue enviado.");
      setStep(2);
    } catch (err) {
      toast.error(err.message || "Error al procesar solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (resetData.nuevaContrasena !== resetData.confirmarContrasena) {
      return toast.error("Las contraseñas no coinciden");
    }
    
    setLoading(true);
    try {
      await usuariosAPI.resetPassword({ 
          correo, 
          codigo: resetData.codigo, 
          nuevaContrasena: resetData.nuevaContrasena 
      });
      toast.success("Contraseña actualizada exitosamente");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Error al restablecer contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Recuperar Contraseña</h1>
        <p className="subtitle">
          {step === 1 ? "Ingresa tu correo para recibir un código de recuperación" : "Ingresa el código que enviamos a tu correo"}
        </p>

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleForgotSubmit}>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Código"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleResetSubmit}>
            <div className="form-group">
              <label>Código de Verificación (6 dígitos)</label>
              <input
                type="text"
                placeholder="000000"
                value={resetData.codigo}
                onChange={(e) => setResetData({...resetData, codigo: e.target.value})}
                required
                maxLength={6}
              />
            </div>
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={resetData.nuevaContrasena}
                onChange={(e) => setResetData({...resetData, nuevaContrasena: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={resetData.confirmarContrasena}
                onChange={(e) => setResetData({...resetData, confirmarContrasena: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            <Link to="/login" className="link">Volver a Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecuperarPassword;
