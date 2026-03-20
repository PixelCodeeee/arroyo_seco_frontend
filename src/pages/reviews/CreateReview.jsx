// src/pages/reviews/CreateReview.jsx - NUEVO

import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useReviews } from '../../hooks/useReviews';
import ReviewForm from '../../components/reviews/ReviewForm';

const CreateReview = () => {
  const { tipo, id } = useParams(); // tipo: 'oferente', 'producto', 'servicio'
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { createReview } = useReviews();
  
  const pedidoId = searchParams.get('pedido');
  const reservaId = searchParams.get('reserva');

  const handleSubmit = async (data) => {
    try {
      // Construir datos según el tipo
      const reviewData = {
        ...data,
        id_oferente: tipo === 'oferente' ? id : null,
        id_producto: tipo === 'producto' ? id : null,
        id_servicio: tipo === 'servicio' ? id : null,
        id_pedido: pedidoId,
        id_reserva: reservaId,
        compra_verificada: !!(pedidoId || reservaId)
      };
      
      await createReview(reviewData);
      
      // Redirigir de vuelta
      if (tipo === 'oferente') {
        navigate(`/oferente/${id}`);
      } else if (tipo === 'producto') {
        navigate(`/productos/${id}`);
      } else if (tipo === 'servicio') {
        navigate(`/servicios/${id}`);
      }
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  return (
    <div className="create-review-page">
      <ReviewForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        targetType={tipo}
        targetId={id}
        orderId={pedidoId}
        reservationId={reservaId}
      />
    </div>
  );
};

export default CreateReview;