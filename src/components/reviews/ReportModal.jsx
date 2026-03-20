// src/components/reviews/ReportModal.jsx - Versión corregida

import React, { useState } from 'react';
import { useReviews } from '../../hooks/useReviews';
import '../../styles/reviews/ReportModal.css';

const ReportModal = ({ reviewId, onClose, onReported }) => {
  const [formData, setFormData] = useState({
    motivo: 'ofensivo' // Valor por defecto válido
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { reportReview } = useReviews();

  // Motivos válidos según el backend
  const motivos = [
    { value: 'ofensivo', label: 'Contenido ofensivo' },
    { value: 'spam', label: 'Spam' },
    { value: 'falso', label: 'Información falsa' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // El backend solo espera motivo, sin comentario
      await reportReview(reviewId, formData.motivo);
      setSuccess(true);
      
      if (onReported) onReported();
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al reportar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="report-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h3>Reportar Reseña</h3>

        {success ? (
          <div className="success-message">
            ✓ Reporte enviado correctamente
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Motivo del reporte</label>
              <select
                value={formData.motivo}
                onChange={(e) => setFormData({motivo: e.target.value})}
                required
              >
                {motivos.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Enviando...' : 'Enviar reporte'}
              </button>
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;