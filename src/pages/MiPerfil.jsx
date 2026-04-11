// src/components/MiPerfil.jsx
import React, { useState, useEffect } from "react";
import { usuariosAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import Layout from "../components/Layout";
import "../styles/MiPerfil.css";
import { CheckCircle, Mail, Key, User as UserIcon, Phone, MapPin, X } from 'lucide-react';

function MiPerfil() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
  });
  const [originalEmail, setOriginalEmail] = useState("");

  const [passwordData, setPasswordData] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  });

  // Modal Email State
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [emailChangeToken, setEmailChangeToken] = useState("");
  const [emailVerificationCode, setEmailVerificationCode] = useState("");

  // Modal Forgot Password State
  const [showForgotPwdModal, setShowForgotPwdModal] = useState(false);
  const [forgotPwdCode, setForgotPwdCode] = useState("");
  const [forgotPwdNew, setForgotPwdNew] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await usuariosAPI.getPerfil();
        setFormData({
            nombre: response.nombre || "",
            correo: response.correo || "",
            telefono: response.telefono || "",
            direccion: response.direccion || ""
        });
        setOriginalEmail(response.correo || "");
      } catch {
        console.error("Error loading user profile");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const submitProfileOnly = async (forcedEmail = null) => {
      try {
        await usuariosAPI.actualizarPerfil({
            ...formData, 
            correo: forcedEmail || originalEmail // Override changed email with original so backend doesn't crash, unless verified
        });
        toast.success("Perfil actualizado correctamente");
      } catch (err) {
        toast.error("Error al actualizar información personal");
      }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Check if email changed
    if (formData.correo !== originalEmail) {
      try {
        const res = await usuariosAPI.solicitarCambioCorreo(user.id_usuario, { nuevoCorreo: formData.correo });
        setEmailChangeToken(res.changeToken);
        setShowEmailVerificationModal(true);
        toast.info("Por favor verifica tu nuevo correo interactuando con el código enviado.");
      } catch (err) {
        toast.error(err.message || "Error al solicitar cambio de correo");
      }
      // Do not return. Submit profile data (with original email applied temporarily to bypass block)
      await submitProfileOnly(originalEmail);
      return;
    }

    await submitProfileOnly(originalEmail);
  };

  const handleVerifyEmailSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerificationCode || emailVerificationCode.length < 6) return toast.error("Ingresa el código de 6 dígitos.");
    
    try {
       await usuariosAPI.verificarCambioCorreo(user.id_usuario, { 
           changeToken: emailChangeToken, 
           codigo: emailVerificationCode 
       });
       toast.success("Correo actualizado de manera segura");
       setShowEmailVerificationModal(false);
       setOriginalEmail(formData.correo);
       setEmailVerificationCode("");
    } catch (err) {
       toast.error(err.message || "Código inválido o expirado");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.nuevaContrasena !== passwordData.confirmarContrasena) {
      return toast.error("Las contraseñas no coinciden");
    }

    try {
      await usuariosAPI.updatePassword(user.id_usuario, {
        contrasenaActual: passwordData.contrasenaActual,
        nuevaContrasena: passwordData.nuevaContrasena
      });
      toast.success("Contraseña actualizada correctamente");
      setPasswordData({ contrasenaActual: "", nuevaContrasena: "", confirmarContrasena: "" });
    } catch (err) {
      toast.error(err.message || "Error al actualizar contraseña");
    }
  };

  const handleInitForgotPwd = async () => {
     try {
        await usuariosAPI.forgotPassword({ correo: formData.correo });
        setShowForgotPwdModal(true);
        toast.info("Código de recuperación enviado a tu correo");
     } catch (err) {
        toast.error("Error al enviar código de recuperación");
     }
  };

  const handleForgotPwdSubmit = async (e) => {
     e.preventDefault();
     if (!forgotPwdCode || forgotPwdCode.length < 6) return toast.error("Ingresa un código válido");
     if (forgotPwdNew.length < 6) return toast.error("La nueva contraseña debe tener al menos 6 caracteres");

     try {
         await usuariosAPI.resetPassword({
             correo: formData.correo,
             codigo: forgotPwdCode,
             nuevaContrasena: forgotPwdNew
         });
         toast.success("Contraseña recuperada y actualizada exitosamente");
         setShowForgotPwdModal(false);
         setForgotPwdCode("");
         setForgotPwdNew("");
     } catch (err) {
         toast.error(err.message || "Código inválido o expirado");
     }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <Layout>
      <div className="perfil-container-modernized" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-primary)' }}>
      <h1 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '2rem', fontWeight: '700' }}>Configuración de Cuenta</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
        {/* Personal Info Section */}
        <div className="card shadow-sm" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
             <UserIcon size={20} /> Información Personal
          </h2>
          <form onSubmit={handleProfileSubmit} className="perfil-form-grid" style={{ display: 'grid', gap: '1.5rem' }}>
            
            <div className="form-group">
              <label style={{ fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Nombre Completo</label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
                <UserIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Correo Electrónico</label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Se enviará código 2FA si modificas esto"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              </div>
              {formData.correo !== originalEmail && (
                 <p style={{ fontSize: '0.85rem', color: 'var(--color-warning)', marginTop: '0.5rem' }}>⚠️ Tendrás que verificar tu correo al guardar.</p>
              )}
            </div>

            {user?.rol === "oferente" && (
              <>
                <div className="form-group">
                  <label style={{ fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Teléfono</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="form-control"
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                    />
                     <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Dirección</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="form-control"
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                    />
                    <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', fontWeight: '600' }}>
               Guardar Información
            </button>
          </form>
        </div>

        {/* Security / Password Section */}
        <div className="card shadow-sm" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
             <Key size={20} /> Seguridad
          </h2>
          <form className="perfil-form-grid" onSubmit={handlePasswordSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Contraseña Actual</label>
                  <button type="button" onClick={handleInitForgotPwd} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}>
                      ¿Olvidaste tu contraseña actual?
                  </button>
              </div>
              <input
                type="password"
                name="contrasenaActual"
                value={passwordData.contrasenaActual}
                onChange={handlePasswordChange}
                required
                className="form-control"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                <label style={{ fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Nueva Contraseña</label>
                <input
                    type="password"
                    name="nuevaContrasena"
                    value={passwordData.nuevaContrasena}
                    onChange={handlePasswordChange}
                    required
                    className="form-control"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
                </div>
                <div className="form-group">
                <label style={{ fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Confirmar Nueva</label>
                <input
                    type="password"
                    name="confirmarContrasena"
                    value={passwordData.confirmarContrasena}
                    onChange={handlePasswordChange}
                    required
                    className="form-control"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
                </div>
            </div>

            <button type="submit" className="btn-outline" style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', fontWeight: '600' }}>
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>

       {/* Email Verification Custom Modal overlaid atop screen */}
       {showEmailVerificationModal && (
        <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
           <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '100%', position: 'relative' }}>
              <button 
                 onClick={() => setShowEmailVerificationModal(false)}
                 style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                 <X size={24} color="#6b7280" />
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                 <Mail size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                 <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 'bold' }}>Verifica tu Correo</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Hemos enviado un código de 6 dígitos a <strong>{formData.correo}</strong>.
                 </p>
              </div>

              <form onSubmit={handleVerifyEmailSubmit}>
                 <input 
                    type="text" 
                    placeholder="Ej. 123456"
                    maxLength={6}
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value)}
                    style={{ width: '100%', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}
                 />
                 <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold' }}>
                    Confirmar Cambio
                 </button>
              </form>
           </div>
        </div>
      )}

       {/* Forgot Password Modal */}
       {showForgotPwdModal && (
        <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
           <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '100%', position: 'relative' }}>
              <button 
                 onClick={() => setShowForgotPwdModal(false)}
                 style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                 <X size={24} color="#6b7280" />
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                 <Key size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                 <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 'bold' }}>Recuperar Contraseña</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Se ha enviado un código de recuperación a <strong>{formData.correo}</strong>.
                 </p>
              </div>

              <form onSubmit={handleForgotPwdSubmit}>
                 <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Código de 6 dígitos</label>
                    <input 
                        type="text" 
                        placeholder="Ej. 123456"
                        maxLength={6}
                        value={forgotPwdCode}
                        onChange={(e) => setForgotPwdCode(e.target.value)}
                        style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.5rem', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                    />
                 </div>
                 <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Nueva Contraseña</label>
                    <input 
                        type="password" 
                        placeholder="Mínimo 6 caracteres"
                        value={forgotPwdNew}
                        onChange={(e) => setForgotPwdNew(e.target.value)}
                        style={{ width: '100%', fontSize: '1rem', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                    />
                 </div>
                 <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold' }}>
                    Actualizar Contraseña
                 </button>
              </form>
           </div>
        </div>
      )}

      </div>
    </Layout>
  );
}

export default MiPerfil;
