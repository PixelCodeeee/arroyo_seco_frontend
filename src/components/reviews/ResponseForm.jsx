// src/components/reviews/ResponseForm.jsx
import React, { useState } from 'react';
import '../../styles/reviews/ResponseForm.css';

const ResponseForm = ({ reviewId, onSubmit, onCancel }) => {
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mensaje.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await onSubmit(reviewId, mensaje);
            setMensaje('');
            onCancel();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al enviar respuesta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="response-form">
            <h4>Responder a esta reseña</h4>
            
            <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu respuesta..."
                rows="3"
                required
                maxLength={500}
            />

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'Enviando...' : 'Publicar respuesta'}
                </button>
                <button type="button" onClick={onCancel} className="btn-cancel">
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default ResponseForm;