// src/components/admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useReviews } from '../../hooks/useReviews';
import Layout from '../../components/Layout';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
    const { 
        getDashboard, 
        getTopOferentes, 
        getActiveUsers 
    } = useReviews();
    
    const [dashboard, setDashboard] = useState(null);
    const [topOferentes, setTopOferentes] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
        loadTopOferentes();
        loadActiveUsers();
    }, []);

    const loadDashboardData = async () => {
        try {
            const data = await getDashboard();
            setDashboard(data);
            console.log('📊 Dashboard stats:', data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    };

    const loadTopOferentes = async () => {
        try {
            const data = await getTopOferentes();
            // Asegurar que data es un array
            const oferentesList = Array.isArray(data) ? data : [];
            setTopOferentes(oferentesList);
            console.log('🏆 Top oferentes:', oferentesList);
        } catch (error) {
            console.error('Error loading top oferentes:', error);
            setTopOferentes([]);
        }
    };

    const loadActiveUsers = async () => {
        try {
            const data = await getActiveUsers();
            // Asegurar que data es un array
            const usersList = Array.isArray(data) ? data : [];
            setActiveUsers(usersList);
            console.log('👥 Usuarios activos:', usersList);
        } catch (error) {
            console.error('Error loading active users:', error);
            setActiveUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para formatear el promedio
    const formatPromedio = (promedio) => {
        if (promedio === null || promedio === undefined) return '0.0';
        const num = parseFloat(promedio);
        return isNaN(num) ? '0.0' : num.toFixed(1);
    };

    if (loading) {
        return (
            <Layout>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando panel de administración...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <h1>📊 Panel de Administración</h1>
                    <p>Bienvenido, Administrador</p>
                </div>

                {/* Estadísticas Generales */}
                {dashboard && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📝</div>
                            <div className="stat-info">
                                <div className="stat-value">{dashboard.reviews?.total || 0}</div>
                                <div className="stat-label">Total Reseñas</div>
                                <div className="stat-sub">
                                    <span>📌 Publicadas: {dashboard.reviews?.publicadas || 0}</span>
                                    <span>🔒 Ocultas: {dashboard.reviews?.ocultas || 0}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">🚩</div>
                            <div className="stat-info">
                                <div className="stat-value">{dashboard.reportes_pendientes || 0}</div>
                                <div className="stat-label">Reportes Pendientes</div>
                                <div className="stat-sub">
                                    <span>⚠️ Requieren atención</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-info">
                                <div className="stat-value">{activeUsers.length || 0}</div>
                                <div className="stat-label">Usuarios Activos</div>
                                <div className="stat-sub">
                                    <span>✍️ Han escrito reseñas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Oferentes Mejor Calificados */}
                <div className="dashboard-section">
                    <h2>🏆 Lugares Mejor Calificados</h2>
                    {topOferentes.length === 0 ? (
                        <p className="empty-text">No hay datos disponibles</p>
                    ) : (
                        <div className="top-list">
                            {topOferentes.map((oferente, index) => (
                                <div key={index} className="top-item">
                                    <div className="top-rank">{index + 1}</div>
                                    <div className="top-info">
                                        <div className="top-name">{oferente.nombre_negocio || 'Sin nombre'}</div>
                                        <div className="top-stats">
                                            <span className="top-rating">⭐ {formatPromedio(oferente.promedio)}</span>
                                            <span className="top-reviews">📝 {oferente.total_reviews || 0} reseñas</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Usuarios Más Activos */}
                <div className="dashboard-section">
                    <h2>👥 Usuarios Más Activos</h2>
                    {activeUsers.length === 0 ? (
                        <p className="empty-text">No hay datos disponibles</p>
                    ) : (
                        <div className="users-list">
                            {activeUsers.map((user, index) => (
                                <div key={index} className="user-item">
                                    <div className="user-rank">{index + 1}</div>
                                    <div className="user-info">
                                        <div className="user-name">{user.nombre || 'Usuario'}</div>
                                        <div className="user-stats">
                                            <span className="user-reviews">📝 {user.reviews || 0} reseñas</span>
                                            {user.correo && <span className="user-email">📧 {user.correo}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;