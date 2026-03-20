// src/components/reviews/ReviewForm.jsx
import React, { useState } from 'react';
import RatingStars from './RatingStars';
import '../../styles/reviews/ReviewForm.css';

const ReviewForm = ({ 
    onSubmit, 
    onCancel,
    initialData = {},
    targetType, // 'producto', 'servicio', 'oferente'
    targetId,
    orderId = null,
    reservationId = null
}) => {
    const [formData, setFormData] = useState({
        rating: initialData.rating || 5,
        titulo: initialData.titulo || '',
        comentario: initialData.comentario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para manejar el cambio de rating
    const handleRatingChange = (newRating) => {
        console.log('Rating cambiado a:', newRating);
        setFormData(prev => ({
            ...prev,
            rating: newRating
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Verificar que el rating existe y es válido
            if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
                throw new Error('Por favor selecciona una calificación válida (1-5 estrellas)');
            }

            // Construir el objeto exactamente como lo espera el backend
            const reviewData = {
                // El campo dinámico basado en targetType
                ...(targetType === 'oferente' && { id_oferente: targetId }),
                ...(targetType === 'producto' && { id_producto: targetId }),
                ...(targetType === 'servicio' && { id_servicio: targetId }),
                ...(orderId && { id_pedido: orderId }),
                ...(reservationId && { id_reserva: reservationId }),
                rating: Number(formData.rating), // Asegurar que es número
                titulo: formData.titulo.trim(),
                comentario: formData.comentario.trim()
            };
            
            console.log('📝 Enviando review data:', JSON.stringify(reviewData, null, 2));
            
            await onSubmit(reviewData);
            
            if (!initialData.id_review) {
                setFormData({ rating: 5, titulo: '', comentario: '' });
            }
        } catch (err) {
            console.error('❌ Error en ReviewForm:', err);
            setError(err.message || 'Error al guardar reseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>{initialData.id_review ? 'Editar reseña' : 'Escribir reseña'}</h3>
            
            <div className="form-group">
                <label>Calificación</label>
                <RatingStars 
                    rating={formData.rating} 
                    onRatingChange={handleRatingChange}
                />
                {/* Mostrar el rating actual para debugging */}
                <small style={{ color: '#999', marginTop: '5px', display: 'block' }}>
                    Rating seleccionado: {formData.rating} estrellas
                </small>
            </div>

            <div className="form-group">
                <label htmlFor="titulo">Título</label>
                <input
                    type="text"
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Resumen de tu experiencia"
                    required
                    maxLength={100}
                />
            </div>

            <div className="form-group">
                <label htmlFor="comentario">Comentario</label>
                <textarea
                    id="comentario"
                    value={formData.comentario}
                    onChange={(e) => setFormData({...formData, comentario: e.target.value})}
                    placeholder="Cuéntanos tu experiencia..."
                    required
                    rows="4"
                    maxLength={1000}
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-submit"
                    style={{
                        background: '#e3008c',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem 2rem',
                        borderRadius: '25px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Guardando...' : (initialData.id_review ? 'Actualizar' : 'Publicar reseña')}
                </button>
                {onCancel && (
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="btn-cancel"
                        style={{
                            background: 'transparent',
                            color: '#e3008c',
                            border: '2px solid #e3008c',
                            padding: '0.8rem 2rem',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            marginLeft: '1rem'
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default ReviewForm;