// src/components/reviews/ReviewResponse.jsx - VERSIÓN SIMPLIFICADA

import React from 'react';
import '../../styles/reviews/ReviewResponse.css';

const ReviewResponse = ({ response }) => {
    return (
        <div className="review-response">
            <div className="response-header">
                <strong>{response.oferente_nombre || 'Negocio'}</strong>
                <span className="response-date">
                    {new Date(response.fecha_creacion).toLocaleDateString()}
                </span>
            </div>
            <p className="response-message">{response.mensaje}</p>
        </div>
    );
};

export default ReviewResponse;