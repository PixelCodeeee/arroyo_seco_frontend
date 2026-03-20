// src/pages/reviews/MisResenas.jsx - TURISTA

import React, { useEffect, useState } from 'react';
import { useReviews } from '../../hooks/useReviews';
import '../../styles/pages/MisResenas.css';

const MisResenas = () => {
    const { 
        reviews, 
        pagination, 
        loading, 
        error,
        fetchMyReviews,
        updateReview,
        deleteReview
    } = useReviews();

    const [page, setPage] = useState(1);
    const [expandedReview, setExpandedReview] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [editComment, setEditComment] = useState('');
    const [editRating, setEditRating] = useState(5);

    // Funciones para separar título y cuerpo
    const getTitleFromComment = (text) => {
        if (!text) return '';
        const lines = text.split('\n');
        return lines[0];
    };

    const getBodyFromComment = (text) => {
        if (!text) return '';
        const lines = text.split('\n');
        lines.shift();
        return lines.join('\n');
    };

    useEffect(() => {
        fetchMyReviews(page);
    }, [page]);

    const handleUpdate = async (id_review, data) => {
        try {
            await updateReview(id_review, data);
            setEditingReview(null);
            fetchMyReviews(page);
        } catch (error) {
            console.error('Error updating review:', error);
            alert('Error al actualizar la reseña');
        }
    };

    const handleDelete = async (id_review) => {
        if (window.confirm('¿Estás seguro de eliminar esta reseña? Esta acción no se puede deshacer.')) {
            try {
                await deleteReview(id_review);
                fetchMyReviews(page);
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('Error al eliminar la reseña');
            }
        }
    };

    const startEditing = (review) => {
        setEditingReview(review.id_review);
        setEditComment(review.comentario || '');
        setEditRating(review.rating || 5);
    };

    const cancelEditing = () => {
        setEditingReview(null);
        setEditComment('');
        setEditRating(5);
    };

    // SVG por defecto para cuando no hay imagen
    const defaultImage = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="#4a90e2">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    `);

    const handleImageError = (e) => {
        e.target.src = defaultImage;
        e.target.onerror = null;
    };

    if (loading && page === 1) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando tus reseñas...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <p className="error-message">❌ {error}</p>
            <button onClick={() => fetchMyReviews(page)} className="btn-retry">
                Reintentar
            </button>
        </div>
    );

    if (!reviews || reviews.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No has escrito ninguna reseña aún</h3>
                <p>¡Explora nuestros productos y gastronomía y comparte tu experiencia!</p>
                <button 
                    onClick={() => window.location.href = '/oferentes'} 
                    className="btn-explorar"
                >
                    ¡Explorar Ahora!
                </button>
            </div>
        );
    }

    return (
        <div className="mis-resenas-container">
            <div className="resenas-header">
                <span className="resenas-count">Total: {pagination?.total || 0}</span>
            </div>

            <div className="resenas-grid">
                {reviews.map(review => (
                    <div key={review.id_review} className="resena-card-wrapper">
                        {/* Información del oferente */}
                        <div className="oferente-info">
                            {review.oferente_imagen ? (
                                <img 
                                    src={review.oferente_imagen} 
                                    alt={review.oferente_nombre || 'Negocio'}
                                    className="oferente-imagen"
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="oferente-imagen-default">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#4a90e2">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                </div>
                            )}
                            <div className="oferente-detalles">
                                <h4>{review.oferente_nombre || 'Negocio'}</h4>
                            </div>
                        </div>

                        {/* MODO EDICIÓN */}
                        {editingReview === review.id_review ? (
                            <div className="edit-mode">
                                <div className="edit-rating">
                                    <label>Calificación:</label>
                                    <div className="rating-stars">
                                        {[1,2,3,4,5].map(star => (
                                            <span 
                                                key={star}
                                                className={`star ${star <= editRating ? 'filled' : ''}`}
                                                onClick={() => setEditRating(star)}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="edit-comment">
                                    <label>Comentario:</label>
                                    <textarea
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        rows="4"
                                        className="edit-textarea"
                                        placeholder="Escribe tu comentario..."
                                    />
                                </div>

                                <div className="edit-actions">
                                    <button 
                                        onClick={() => handleUpdate(review.id_review, {
                                            rating: editRating,
                                            comentario: editComment
                                        })}
                                        className="btn-save"
                                    >
                                        💾 Guardar
                                    </button>
                                    <button 
                                        onClick={cancelEditing}
                                        className="btn-cancel"
                                    >
                                        ❌ Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* MODO VISUALIZACIÓN CON TÍTULO SEPARADO */
                            <div className="review-card">
                                {/* Fila 1: Usuario y estrellas */}
                                <div className="review-header-row">
                                    <div className="review-user">
                                        <strong>Tú</strong>
                                    </div>
                                    <div className="review-rating-stars">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span 
                                                key={star}
                                                className={`star ${star <= review.rating ? 'filled' : ''}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Fila 2: Fecha */}
                                <div className="review-date-row">
                                    <span className="review-date">
                                        {new Date(review.fecha_creacion).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Fila 3: Título (primera línea) */}
                                {getTitleFromComment(review.comentario) && (
                                    <div className="review-title-row">
                                        <span className="review-title-text">
                                            {getTitleFromComment(review.comentario)}
                                        </span>
                                    </div>
                                )}

                                {/* Fila 4: Cuerpo del comentario (resto) */}
                                {getBodyFromComment(review.comentario) && (
                                    <div className="review-body-row">
                                        <p className="review-body-text">
                                            {getBodyFromComment(review.comentario)}
                                        </p>
                                    </div>
                                )}

                                {/* Si solo hay título sin cuerpo */}
                                {getTitleFromComment(review.comentario) && !getBodyFromComment(review.comentario) && (
                                    <div className="review-body-row">
                                        <p className="review-body-text">
                                            {getTitleFromComment(review.comentario)}
                                        </p>
                                    </div>
                                )}

                                {review.compra_verificada && (
                                    <div className="review-verified">
                                        <span className="verified-badge">✓ Compra verificada</span>
                                    </div>
                                )}

                                <div className="review-actions">
                                    <button 
                                        onClick={() => startEditing(review)} 
                                        className="btn-edit"
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(review.id_review)} 
                                        className="btn-delete"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="btn-pagination"
                    >
                        ← Anterior
                    </button>
                    
                    <span className="page-info">
                        Página {page} de {pagination.totalPages}
                    </span>
                    
                    <button
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="btn-pagination"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
};

export default MisResenas;