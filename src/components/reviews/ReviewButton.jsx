// src/components/reviews/ReviewButton.jsx - NUEVO

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ReviewButton = ({ targetType, targetId, orderId, reservationId, hasReviewed }) => {
  const navigate = useNavigate();
  const { isTurista, isLoggedIn } = useAuth();

  if (!isLoggedIn || !isTurista) return null;
  if (hasReviewed) return <span className="reviewed-badge">✓ Ya reseñaste</span>;

  const handleClick = () => {
    // Navegar a la página de crear reseña con los parámetros
    let url = `/resenas/crear/${targetType}/${targetId}`;
    if (orderId) url += `?pedido=${orderId}`;
    if (reservationId) url += `?reserva=${reservationId}`;
    navigate(url);
  };

  return (
    <button onClick={handleClick} className="btn-review">
      Escribir Reseña
    </button>
  );
};

export default ReviewButton;