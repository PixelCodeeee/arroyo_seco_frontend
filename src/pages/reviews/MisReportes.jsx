// src/pages/reviews/MisReportes.jsx

import React, { useEffect, useState } from 'react';
import { useReviews } from '../../hooks/useReviews';
import Layout from '../../components/Layout';
import '../../styles/pages/MisReportes.css';

const MisReportes = () => {
    const { getMyReports, loading } = useReviews();
    const [reports, setReports] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadReports();
    }, [page]);

    const loadReports = async () => {
        try {
            const data = await getMyReports(page);
            setReports(data.data || []);
            setPagination(data.pagination || null);
        } catch (error) {
            console.error('Error loading reports:', error);
        }
    };

    const getMotivoText = (motivo) => {
        const motivos = {
            'ofensivo': 'Contenido ofensivo',
            'spam': 'Spam',
            'falso': 'Información falsa',
            'otro': 'Otro motivo'
        };
        return motivos[motivo] || motivo;
    };

    const getMotivoIcon = (motivo) => {
        const iconos = {
            'ofensivo': '😠',
            'spam': '📧',
            'falso': '❌',
            'otro': '📝'
        };
        return iconos[motivo] || '🚩';
    };

    if (loading && page === 1) {
        return (
            <Layout>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando tus reportes...</p>
                </div>
            </Layout>
        );
    }

    if (!reports || reports.length === 0) {
        return (
            <Layout>
                <div className="empty-state">
                    <div className="empty-icon">🚩</div>
                    <h3>No has realizado reportes</h3>
                    <p>Cuando reportes una reseña, aparecerá aquí</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mis-reportes-container">
                <header className="reportes-header">
                    <div className="header-content">
                        <div>
                            <h1>🚩 Mis Reportes</h1>
                        </div>
                        <span className="reportes-count">Total: {pagination?.total || 0}</span>
                    </div>
                </header>

                <div className="reportes-grid">
                    {reports.map(report => (
                        <div key={report.id_review_report} className="reporte-card">
                            <div className="reporte-header">
                                <div className="reporte-info">
                                    <span className="reporte-icon">
                                        {getMotivoIcon(report.motivo)}
                                    </span>
                                    <span className="reporte-motivo">
                                        {getMotivoText(report.motivo)}
                                    </span>
                                </div>
                                <span className={`estado-badge ${report.estado_reporte}`}>
                                    {report.estado_reporte === 'pendiente' ? (
                                        <>
                                            <span className="estado-punto pendiente"></span>
                                            Pendiente
                                        </>
                                    ) : (
                                        <>
                                            <span className="estado-punto resuelto"></span>
                                            Resuelto
                                        </>
                                    )}
                                </span>
                            </div>

                            <div className="reporte-fecha">
                                📅 {new Date(report.fecha_creacion).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>

                            <div className="reporte-review">
                                <div className="review-header">
                                    <strong>📝 Reseña reportada:</strong>
                                    {report.review_rating && (
                                        <div className="review-rating">
                                            {'★'.repeat(report.review_rating)}
                                            {'☆'.repeat(5 - report.review_rating)}
                                        </div>
                                    )}
                                </div>
                                <p className="review-text">
                                    {report.review_comentario || "Sin comentario"}
                                </p>
                                <div className="review-author">
                                    <span className="author-icon">👤</span>
                                    <span>{report.usuario_nombre || 'Usuario'}</span>
                                </div>
                            </div>

                            {report.comentario && (
                                <div className="reporte-comentario">
                                    <strong>💬 Tu comentario:</strong>
                                    <p>{report.comentario}</p>
                                </div>
                            )}

                            {report.fecha_revision && (
                                <div className="reporte-revision">
                                    <strong>🕒 Fecha de revisión:</strong>
                                    <span>
                                        {new Date(report.fecha_revision).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            )}

                            {report.comentario_admin && (
                                <div className="reporte-respuesta">
                                    <strong>👨‍⚖️ Respuesta del administrador:</strong>
                                    <p>{report.comentario_admin}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

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
        </Layout>
    );
};

export default MisReportes;