// src/components/reviews/ReviewList.jsx
import React from 'react';
import ReviewCard from './ReviewCard';
import '../../styles/reviews/ReviewList.css';

const ReviewList = ({ 
    reviews, 
    loading, 
    error, 
    pagination, 
    onPageChange,
    onUpdate,
    onDelete,
    onRespond
}) => {
    if (loading) return <div className="loading-spinner">Cargando reseñas...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!reviews?.length) return <div className="empty-message">No hay reseñas aún</div>;

    return (
        <div className="review-list">
            {reviews.map(review => (
                <ReviewCard
                    key={review.id_review}
                    review={review}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onRespond={onRespond}
                />
            ))}

            {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={pagination.page === 1}
                        onClick={() => onPageChange(pagination.page - 1)}
                    >
                        Anterior
                    </button>
                    <span>Página {pagination.page} de {pagination.totalPages}</span>
                    <button
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => onPageChange(pagination.page + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;