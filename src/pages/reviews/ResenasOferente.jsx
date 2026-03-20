// src/pages/reviews/ResenasOferente.jsx - Versión con filtro frontend

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useReviews } from '../../hooks/useReviews';
import Layout from '../../components/Layout';
import ReviewList from '../../components/reviews/ReviewList';
import ReviewStats from '../../components/reviews/ReviewStats';
import '../../styles/pages/ResenasOferente.css';

const ResenasOferente = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [filterRating, setFilterRating] = useState(null);
    const [negocioSeleccionado, setNegocioSeleccionado] = useState(null);
    
    // 👈 AHORA LOS NEGOCIOS VIENEN DIRECTAMENTE DE user.negocios
    const negocios = user?.negocios || [];
    
    const { 
        reviews, 
        stats,
        pagination, 
        loading, 
        error,
        fetchOferenteReviews,
        createResponse,
        updateResponse,
        deleteResponse
    } = useReviews();

    // Seleccionar el primer negocio por defecto
    useEffect(() => {
        if (negocios.length > 0 && !negocioSeleccionado) {
            setNegocioSeleccionado(negocios[0]);
        }
    }, [negocios]);

    // Cargar reseñas cuando cambia el negocio seleccionado
    useEffect(() => {
        if (negocioSeleccionado?.id_oferente) {
            console.log('📊 Cargando reseñas para negocio ID:', negocioSeleccionado.id_oferente);
            fetchOferenteReviews(negocioSeleccionado.id_oferente, page, 10, filterRating);
        }
    }, [negocioSeleccionado, page, filterRating]);

    const handleRespond = async (id_review, mensaje) => {
        await createResponse(id_review, mensaje);
        if (negocioSeleccionado?.id_oferente) {
            fetchOferenteReviews(negocioSeleccionado.id_oferente, page, 10, filterRating);
        }
    };

    // Si no tiene negocios registrados
    if (negocios.length === 0) {
        return (
            <Layout>
                <div className="resenas-oferente-container">
                    <div className="error-message">
                        <h2>⚠️ No tienes negocios registrados</h2>
                        <p>Para ver las reseñas de tus negocios, primero debes registrar al menos un negocio.</p>
                        <button 
                            onClick={() => window.location.href = '/oferentes/crear'} 
                            className="btn-registrar"
                        >
                            Registrar mi negocio
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="resenas-oferente-page">
                <header className="resenas-header">
                    <div className="header-content">
                        <div>
                            <h1>⭐ Reseñas de mis Negocios</h1>
                            {user && (
                                <p className="welcome-text">
                                    {user.nombre} - {negocios.length} {negocios.length === 1 ? 'negocio' : 'negocios'} registrado{negocios.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                </header>

                {/* Selector de negocio */}
                <div className="negocio-selector">
                    <label>Selecciona un negocio:</label>
                    <select 
                        value={negocioSeleccionado?.id_oferente || ''} 
                        onChange={(e) => {
                            const selected = negocios.find(n => n.id_oferente === parseInt(e.target.value));
                            setNegocioSeleccionado(selected);
                            setPage(1);
                        }}
                        className="negocio-select"
                    >
                        {negocios.map(negocio => (
                            <option key={negocio.id_oferente} value={negocio.id_oferente}>
                                🏪 {negocio.nombre_negocio} ({negocio.tipo === 'restaurante' ? 'Restaurante' : 'Artesanía'})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Información del negocio seleccionado */}
                {negocioSeleccionado && (
                    <div className="negocio-info-card">
                        <div className="negocio-icon">🏪</div>
                        <div className="negocio-detalles">
                            <h3>{negocioSeleccionado.nombre_negocio}</h3>
                            <p>{negocioSeleccionado.tipo === 'restaurante' ? 'Restaurante' : 'Artesanía'}</p>
                            <span className={`negocio-estado ${negocioSeleccionado.estado === 'aprobado' ? 'aprobado' : 'pendiente'}`}>
                                {negocioSeleccionado.estado === 'aprobado' ? '✅ Activo' : '⏳ Pendiente de aprobación'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Estadísticas */}
                <ReviewStats stats={stats} />

                {/* Filtros */}
                <div className="filters-section">
                    <div className="filter-select-container">
                        <select 
                            value={filterRating || ''} 
                            onChange={(e) => setFilterRating(e.target.value || null)}
                            className="filter-select"
                        >
                            <option value="">📊 Todas las calificaciones</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5 estrellas</option>
                            <option value="4">⭐⭐⭐⭐ 4 estrellas</option>
                            <option value="3">⭐⭐⭐ 3 estrellas</option>
                            <option value="2">⭐⭐ 2 estrellas</option>
                            <option value="1">⭐ 1 estrella</option>
                        </select>
                    </div>
                </div>

                {/* Lista de reseñas */}
                <div className="reviews-container">
                    <ReviewList
                        reviews={reviews}
                        loading={loading}
                        error={error}
                        pagination={pagination}
                        onPageChange={setPage}
                        onRespond={handleRespond}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default ResenasOferente;