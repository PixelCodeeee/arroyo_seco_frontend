// src/components/reviews/ReviewCard.jsx - Versión con permisos corregidos

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import RatingStars from './RatingStars';
import ReviewResponse from './ReviewResponse';
import ResponseForm from './ResponseForm';
import ReportModal from './ReportModal';
import '../../styles/reviews/ReviewCard.css';

const ReviewCard = ({ review, onUpdate, onDelete, onRespond }) => {
    const { user } = useAuth();
    const [showReportModal, setShowReportModal] = useState(false);
    const [showResponseForm, setShowResponseForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        rating: review.rating,
        comentario: review.comentario || ''
    });

    // Obtener el ID correctamente
    const userId = user?.id_usuario || user?.id;
    const isOwner = userId === review.id_usuario;
    
    // 👈 VERIFICAR SI EL OFERENTE ES DUEÑO DE ESTE NEGOCIO USANDO user.negocios
    const isOferenteDelNegocio = user?.rol === 'oferente' && 
        user?.negocios?.some(negocio => negocio.id_oferente === review.id_oferente);
    
    const isAdmin = user?.rol === 'admin';

    const canRespond = isOferenteDelNegocio && !review.respuestas?.length;
    const canEdit = isOwner && !isEditing;
    const canDelete = isOwner || isAdmin;
    const canReport = !isOwner && !isAdmin && (user?.rol === 'turista' || user?.rol === 'oferente');

    // 🔍 DEBUG COMPLETO
    console.log('🔍 ReviewCard - Debug:');
    console.log('   user?.id_usuario:', user?.id_usuario);
    console.log('   user?.rol:', user?.rol);
    console.log('   user?.negocios:', user?.negocios?.map(n => ({ id: n.id_oferente, nombre: n.nombre_negocio })));
    console.log('   review.id_usuario:', review.id_usuario);
    console.log('   review.id_oferente:', review.id_oferente);
    console.log('   isOwner:', isOwner);
    console.log('   isOferenteDelNegocio:', isOferenteDelNegocio);
    console.log('   canRespond:', canRespond);
    console.log('   canReport:', canReport);
    console.log('   review.respuestas:', review.respuestas);

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

    const handleEdit = () => {
        setIsEditing(true);
    };
    
    const handleSaveEdit = async () => {
        try {
            await onUpdate(review.id_review, {
                rating: editData.rating,
                comentario: editData.comentario
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error al guardar edición:', error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditData({
            rating: review.rating,
            comentario: review.comentario || ''
        });
    };

    const handleDelete = () => {
        if (window.confirm('¿Eliminar esta reseña?')) {
            onDelete(review.id_review);
        }
    };

    const title = getTitleFromComment(review.comentario);
    const body = getBodyFromComment(review.comentario);

    // MODO EDICIÓN
    if (isEditing) {
        return (
            <div className="review-card editing">
                <div className="review-header">
                    <div className="review-user">
                        <strong>{review.usuario_nombre || 'Usuario'}</strong>
                    </div>
                </div>
                
                <div className="edit-rating">
                    <label>Calificación:</label>
                    <RatingStars 
                        rating={editData.rating} 
                        onRatingChange={(r) => setEditData({...editData, rating: r})}
                    />
                </div>
                
                <div className="edit-comment">
                    <label>Comentario:</label>
                    <textarea
                        value={editData.comentario}
                        onChange={(e) => setEditData({...editData, comentario: e.target.value})}
                        placeholder="Escribe tu comentario..."
                        rows="4"
                        className="edit-textarea"
                    />
                </div>
                
                <div className="edit-actions">
                    <button onClick={handleSaveEdit} className="btn-save">
                        💾 Guardar
                    </button>
                    <button onClick={handleCancelEdit} className="btn-cancel">
                        ❌ Cancelar
                    </button>
                </div>
            </div>
        );
    }
    

    // MODO LECTURA
       // MODO LECTURA
    return (
        <div className="review-card">
            <div className="review-header">
                <div className="review-user">
                    <strong>{review.usuario_nombre || 'Usuario'}</strong>
                    <span className="review-date">
                        {new Date(review.fecha_creacion).toLocaleDateString()}
                    </span>
                </div>
                <RatingStars rating={review.rating} readonly size="small" />
            </div>

            {title && (
                <h4 className="review-title">
                    {title}
                </h4>
            )}

            {body && (
                <p className="review-comment">
                    {body}
                </p>
            )}

            {title && !body && (
                <p className="review-comment">
                    {title}
                </p>
            )}

            {review.compra_verificada && (
                <span className="verified-badge">✓ Compra verificada</span>
            )}

            {/* 👇 RESPUESTAS EXISTENTES - AÑADIDO */}
            {review.respuestas?.map(respuesta => (
                <ReviewResponse 
                    key={respuesta.id_review_response} 
                    response={respuesta}
                />
            ))}

            {/* Formulario de respuesta */}
            {showResponseForm && (
                <ResponseForm
                    reviewId={review.id_review}
                    onSubmit={onRespond}
                    onCancel={() => setShowResponseForm(false)}
                />
            )}

            {/* Botones de acción */}
            <div className="review-actions">
                {canRespond && (
                    <button onClick={() => setShowResponseForm(true)} className="btn-respond">
                        Responder
                    </button>
                )}
                {canEdit && (
                    <button onClick={handleEdit} className="btn-edit">
                        Editar
                    </button>
                )}
                {canDelete && (
                    <button onClick={handleDelete} className="btn-delete">
                        Eliminar
                    </button>
                )}
                {canReport && (
                    <button onClick={() => setShowReportModal(true)} className="btn-report">
                        Reportar
                    </button>
                )}
            </div>

            {/* Modal de reporte */}
            {showReportModal && (
                <ReportModal
                    reviewId={review.id_review}
                    onClose={() => setShowReportModal(false)}
                />
            )}
        </div>
    );
};

export default ReviewCard;