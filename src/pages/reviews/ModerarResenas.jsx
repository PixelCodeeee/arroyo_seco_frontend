// src/pages/reviews/ModerarResenas.jsx

import React, { useEffect, useState } from 'react';
import { useReviews } from '../../hooks/useReviews';
import Layout from '../../components/Layout';
import '../../styles/pages/ModerarResenas.css';

const ModerarResenas = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const { getPendingReports, moderateReview, resolveReport } = useReviews();

    useEffect(() => {
        loadReports();
    }, [page]);

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await getPendingReports(page);
            console.log('📡 Reportes recibidos:', data);
            
            // La estructura puede ser { data: [], pagination: {} }
            setReports(data.data || []);
            setPagination(data.pagination || null);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModerate = async (id_review, accion, id_reporte) => {
        const acciones = {
            hide: 'ocultar',
            delete: 'eliminar',
            unhide: 'mantener'
        };
        
        if (window.confirm(`¿Estás seguro de ${acciones[accion]} esta reseña?`)) {
            try {
                await moderateReview(id_review, accion);
                await resolveReport(id_reporte);
                loadReports();
                alert(`✅ Reseña ${acciones[accion]} correctamente`);
            } catch (error) {
                console.error('Error moderating:', error);
                alert('❌ Error al procesar la acción');
            }
        }
    };

    const getMotivoText = (motivo) => {
        const motivos = {
            'ofensivo': '😠 Contenido ofensivo',
            'spam': '📧 Spam',
            'falso': '❌ Información falsa',
            'otro': '📝 Otro motivo'
        };
        return motivos[motivo] || motivo;
    };

    const getMotivoColor = (motivo) => {
        const colores = {
            'ofensivo': '#dc3545',
            'spam': '#ffc107',
            'falso': '#fd7e14',
            'otro': '#6c757d'
        };
        return colores[motivo] || '#6c757d';
    };

    if (loading && page === 1) {
        return (
            <Layout>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando reportes pendientes...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="moderar-resenas-page">
                <header className="moderar-header">
                    <div className="header-content">
                        <div>
                            <h1>⚖️ Moderación de Reseñas</h1>
                            <p className="subtitle">Revisa y gestiona los reportes de usuarios</p>
                        </div>
                        <span className="reports-count">
                            {pagination?.total || reports.length} reporte{(pagination?.total || reports.length) !== 1 ? 's' : ''} pendiente{(pagination?.total || reports.length) !== 1 ? 's' : ''}
                        </span>
                    </div>
                </header>

                {(!reports || reports.length === 0) ? (
                    <div className="empty-state">
                        <div className="empty-icon">✅</div>
                        <h3>No hay reportes pendientes</h3>
                        <p>Todos los reportes han sido revisados</p>
                    </div>
                ) : (
                    <div className="reports-list">
                        {reports.map(report => (
                            <div key={report.id_review_report} className="report-card">
                                <div className="report-header">
                                    <span 
                                        className="report-motivo"
                                        style={{ backgroundColor: getMotivoColor(report.motivo), color: 'white' }}
                                    >
                                        {getMotivoText(report.motivo)}
                                    </span>
                                    <span className="report-fecha">
                                        📅 {new Date(report.fecha_creacion || report.fecha_reporte).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="report-content">
                                    <div className="reported-review">
                                        <h4>📝 Reseña reportada</h4>
                                        <div className="review-rating">
                                            {'★'.repeat(report.rating || report.review_rating)}
                                            {'☆'.repeat(5 - (report.rating || report.review_rating))}
                                        </div>
                                        <p className="review-text">"{report.comentario_resena || report.review_comentario}"</p>
                                        <div className="review-author">
                                            <strong>Autor:</strong> {report.autor_nombre || report.usuario_nombre || 'Usuario'}
                                        </div>
                                        <div className="review-business">
                                            <strong>Negocio:</strong> {report.nombre_negocio || 'No especificado'}
                                        </div>
                                    </div>

                                    <div className="report-details">
                                        <h4>🚩 Detalles del reporte</h4>
                                        <p><strong>Reportado por:</strong> {report.reportero_nombre || report.reporter_nombre || 'Usuario'}</p>
                                        <p><strong>Rol del reportero:</strong> 
                                            <span className={`rol-badge ${report.reportero_rol === 'oferente' ? 'rol-oferente' : 'rol-turista'}`}>
                                                {report.reportero_rol === 'oferente' ? '🏪 Oferente' : '👤 Turista'}
                                            </span>
                                        </p>
                                        <p><strong>Motivo:</strong> {getMotivoText(report.motivo)}</p>
                                        {report.comentario && (
                                            <p><strong>Comentario adicional:</strong> {report.comentario}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="report-actions">
                                    <button 
                                        onClick={() => handleModerate(report.id_review, 'hide', report.id_review_report)}
                                        className="btn-hide"
                                    >
                                        🔒 Ocultar reseña
                                    </button>
                                    <button 
                                        onClick={() => handleModerate(report.id_review, 'delete', report.id_review_report)}
                                        className="btn-delete"
                                    >
                                        🗑️ Eliminar reseña
                                    </button>
                                    <button 
                                        onClick={() => handleModerate(report.id_review, 'unhide', report.id_review_report)}
                                        className="btn-keep"
                                    >
                                        ✅ Mantener reseña
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            ← Anterior
                        </button>
                        <span>Página {page} de {pagination.totalPages}</span>
                        <button 
                            disabled={page === pagination.totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Siguiente →
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ModerarResenas;