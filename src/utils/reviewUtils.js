// src/utils/reviewUtils.js
/**
 * Utilidades para manejo de reseñas
 */

// Formatear fecha
export const formatReviewDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
};

// Obtener texto de calificación
export const getRatingText = (rating) => {
    const texts = {
        1: 'Pésimo',
        2: 'Malo',
        3: 'Regular',
        4: 'Bueno',
        5: 'Excelente'
    };
    return texts[rating] || 'Sin calificar';
};

// Obtener color según calificación
export const getRatingColor = (rating) => {
    const colors = {
        1: '#dc3545', // rojo
        2: '#fd7e14', // naranja
        3: '#ffc107', // amarillo
        4: '#20c997', // verde claro
        5: '#28a745'  // verde
    };
    return colors[rating] || '#6c757d';
};

// Validar reseña antes de enviar
export const validateReview = (reviewData) => {
    const errors = {};

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        errors.rating = 'La calificación debe ser entre 1 y 5';
    }

    if (!reviewData.titulo || reviewData.titulo.trim().length < 3) {
        errors.titulo = 'El título debe tener al menos 3 caracteres';
    } else if (reviewData.titulo.length > 100) {
        errors.titulo = 'El título no puede exceder 100 caracteres';
    }

    if (!reviewData.comentario || reviewData.comentario.trim().length < 10) {
        errors.comentario = 'El comentario debe tener al menos 10 caracteres';
    } else if (reviewData.comentario.length > 1000) {
        errors.comentario = 'El comentario no puede exceder 1000 caracteres';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Calcular promedio de ratings
export const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
};

// Distribución de ratings
export const getRatingDistribution = (reviews) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    if (!reviews || reviews.length === 0) return distribution;
    
    reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
            distribution[review.rating]++;
        }
    });
    
    return distribution;
};

// Filtrar reseñas por calificación
export const filterReviewsByRating = (reviews, rating) => {
    if (!rating) return reviews;
    return reviews.filter(review => review.rating === parseInt(rating));
};

// Ordenar reseñas
export const sortReviews = (reviews, sortBy = 'recent') => {
    const sorted = [...reviews];
    
    switch(sortBy) {
        case 'recent':
            return sorted.sort((a, b) => 
                new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
            );
        case 'oldest':
            return sorted.sort((a, b) => 
                new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
            );
        case 'highest':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'lowest':
            return sorted.sort((a, b) => a.rating - b.rating);
        default:
            return sorted;
    }
};

// Truncar texto largo
export const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Obtener iniciales del usuario para avatar
export const getUserInitials = (nombre) => {
    if (!nombre) return 'U';
    return nombre
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

// Verificar si usuario puede editar review
export const canEditReview = (review, userId, userRole) => {
    if (userRole === 'admin') return true;
    return review.id_usuario === userId;
};

// Verificar si usuario puede eliminar review
export const canDeleteReview = (review, userId, userRole) => {
    if (userRole === 'admin') return true;
    return review.id_usuario === userId;
};

// Verificar si oferente puede responder
export const canRespondToReview = (review, oferenteId, userRole, hasResponse) => {
    if (userRole !== 'oferente') return false;
    if (hasResponse) return false;
    return review.id_oferente === oferenteId;
};

// Obtener mensaje de error amigable
export const getReviewErrorMessage = (error) => {
    const errorMessages = {
        'Ya has escrito una review': 'Ya escribiste una reseña para este elemento',
        'Review no encontrada': 'La reseña no existe o fue eliminada',
        'No tienes permiso': 'No tienes permiso para realizar esta acción',
        'El mensaje es requerido': 'Debes escribir un mensaje',
        'Esta review ya tiene una respuesta': 'Esta reseña ya tiene una respuesta'
    };

    return errorMessages[error] || error || 'Error al procesar la solicitud';
};