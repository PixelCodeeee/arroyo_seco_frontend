import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';

function TwoFactorVerification({ userId, onSuccess, onResend }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setLoading(true);

    try {
      await onSuccess(code);
    } catch (err) {
      setError(err.message || 'Código inválido o expirado');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);
    setCountdown(60);

    try {
      await onResend();
    } catch (err) {
      setError('Error al reenviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="verification-icon">✉️</div>
        <h1>Verificación en dos pasos</h1>
        <p className="subtitle">
          Hemos enviado un código de 6 dígitos a tu correo electrónico
        </p>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Código de verificación</label>
            <input
              type="text"
              id="code"
              name="code"
              placeholder="000000"
              value={code}
              onChange={handleCodeChange}
              className="code-input"
              maxLength={6}
              autoFocus
              required
            />
            <small className="form-hint">Ingresa el código de 6 dígitos</small>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || code.length !== 6}
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No recibiste el código?{' '}
            {countdown > 0 ? (
              <span className="countdown">Reenviar en {countdown}s</span>
            ) : (
              <button
                onClick={handleResend}
                className="link-button"
                disabled={loading}
              >
                Reenviar código
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TwoFactorVerification;