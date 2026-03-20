// src/hooks/useReviews.jsx
import { useState, useCallback } from 'react';
import { reviewsAPI } from '../services/api';

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========== OBTENER REVIEWS ==========
  const fetchOferenteReviews = useCallback(async (id_oferente, page = 1, limit = 10, rating = null) => {
    if (!id_oferente) {
      setError('ID de oferente no proporcionado');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching reviews for oferente:', id_oferente);
      const data = await reviewsAPI.getOferenteReviews(id_oferente, page, limit, rating);
      
      console.log('✅ Reviews data:', data);
      setReviews(data.data || []);
      setStats(data.stats || null);
      setPagination(data.pagination || null);
      
    } catch (err) {
      console.error('❌ Error fetching reviews:', err);
      setError(err.message || 'Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductoReviews = useCallback(async (id_producto, page = 1, limit = 10) => {
    if (!id_producto) {
      setError('ID de producto no proporcionado');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await reviewsAPI.getProductoReviews(id_producto, page, limit);
      setReviews(data.data || []);
      setStats(data.stats || null);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Error fetching product reviews:', err);
      setError(err.message || 'Error al cargar reseñas del producto');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServicioReviews = useCallback(async (id_servicio, page = 1, limit = 10) => {
    if (!id_servicio) {
      setError('ID de servicio no proporcionado');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await reviewsAPI.getServicioReviews(id_servicio, page, limit);
      setReviews(data.data || []);
      setStats(data.stats || null);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Error fetching service reviews:', err);
      setError(err.message || 'Error al cargar reseñas del servicio');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyReviews = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await reviewsAPI.getMisReviews(page, limit);
      setReviews(data.data || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Error fetching my reviews:', err);
      setError(err.message || 'Error al cargar tus reseñas');
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== CREAR REVIEW ==========
  const createReview = useCallback(async (reviewData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📝 Creating review:', reviewData);
      const result = await reviewsAPI.create(reviewData);
      console.log('✅ Review created:', result);
      return result;
    } catch (err) {
      console.error('❌ Error creating review:', err);
      setError(err.message || 'Error al crear reseña');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== ACTUALIZAR REVIEW ==========
  const updateReview = useCallback(async (id_review, reviewData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📝 Updating review:', id_review, reviewData);
      const result = await reviewsAPI.update(id_review, reviewData);
      console.log('✅ Review updated:', result);
      return result;
    } catch (err) {
      console.error('❌ Error updating review:', err);
      setError(err.message || 'Error al actualizar reseña');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== ELIMINAR REVIEW ==========
  const deleteReview = useCallback(async (id_review) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🗑️ Deleting review:', id_review);
      const result = await reviewsAPI.delete(id_review);
      console.log('✅ Review deleted:', result);
      return result;
    } catch (err) {
      console.error('❌ Error deleting review:', err);
      setError(err.message || 'Error al eliminar reseña');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== RESPUESTAS ==========
  const createResponse = useCallback(async (id_review, mensaje) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('💬 Creating response for review:', id_review);
      const result = await reviewsAPI.createResponse(id_review, mensaje);
      console.log('✅ Response created:', result);
      return result;
    } catch (err) {
      console.error('❌ Error creating response:', err);
      setError(err.message || 'Error al crear respuesta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResponse = useCallback(async (id_response, mensaje) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📝 Updating response:', id_response);
      const result = await reviewsAPI.updateResponse(id_response, mensaje);
      console.log('✅ Response updated:', result);
      return result;
    } catch (err) {
      console.error('❌ Error updating response:', err);
      setError(err.message || 'Error al actualizar respuesta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteResponse = useCallback(async (id_response) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🗑️ Deleting response:', id_response);
      const result = await reviewsAPI.deleteResponse(id_response);
      console.log('✅ Response deleted:', result);
      return result;
    } catch (err) {
      console.error('❌ Error deleting response:', err);
      setError(err.message || 'Error al eliminar respuesta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== REPORTES ==========
  const reportReview = useCallback(async (id_review, motivo, comentario) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚩 Reporting review:', id_review);
      const result = await reviewsAPI.report(id_review, motivo, comentario);
      console.log('✅ Review reported:', result);
      return result;
    } catch (err) {
      console.error('❌ Error reporting review:', err);
      setError(err.message || 'Error al reportar reseña');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== MIS REPORTES ==========
  const getMyReports = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📋 Obteniendo mis reportes, página:', page);
      const data = await reviewsAPI.getMyReports(page, limit);
      console.log('📋 Mis reportes:', data);
      return data;
    } catch (err) {
      console.error('❌ Error fetching my reports:', err);
      setError(err.message || 'Error al cargar reportes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== ADMIN - REPORTES PENDIENTES ==========
  const getPendingReports = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📋 Obteniendo reportes pendientes, página:', page);
      const data = await reviewsAPI.getPendingReports(page, limit);
      console.log('📋 Reportes pendientes:', data);
      return data;
    } catch (err) {
      console.error('Error fetching pending reports:', err);
      setError(err.message || 'Error al cargar reportes pendientes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

 // ========== ADMIN - MODERAR REVIEW ==========
const moderateReview = useCallback(async (id_review, accion) => {
    setLoading(true);
    setError(null);
    
    try {
        console.log(`📡 Moderando review ${id_review} con acción: ${accion}`);
        // 👈 CORREGIR: usar moderateReview en lugar de moderate
        const result = await reviewsAPI.moderateReview(id_review, accion);
        return result;
    } catch (err) {
        console.error('Error moderating review:', err);
        setError(err.message || 'Error al moderar reseña');
        throw err;
    } finally {
        setLoading(false);
    }
}, []);

  // ========== ADMIN - RESOLVER REPORTE ==========
  const resolveReport = useCallback(async (id_reporte, estado = 'resuelto') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`📡 Resolviendo reporte ${id_reporte}`);
      const result = await reviewsAPI.resolveReport(id_reporte, estado);
      return result;
    } catch (err) {
      console.error('Error resolving report:', err);
      setError(err.message || 'Error al resolver reporte');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== ESTADÍSTICAS ==========
  const fetchOferenteStats = useCallback(async (id_oferente) => {
    try {
      const data = await reviewsAPI.getOferenteStats(id_oferente);
      setStats(data);
      return data;
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // ========== ADMIN - DASHBOARD ==========
  const getDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 Obteniendo dashboard...');
      const data = await reviewsAPI.getDashboard();
      console.log('📊 Dashboard:', data);
      return data;
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.message || 'Error al cargar dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== ADMIN - TOP OFERENTES ==========
  const getTopOferentes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🏆 Obteniendo top oferentes...');
      const data = await reviewsAPI.getTopOferentes();
      console.log('🏆 Top oferentes:', data);
      return data;
    } catch (err) {
      console.error('Error fetching top oferentes:', err);
      setError(err.message || 'Error al cargar top oferentes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== ADMIN - USUARIOS ACTIVOS ==========
  const getActiveUsers = useCallback(async (fecha_inicio, fecha_fin) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('👥 Obteniendo usuarios activos...');
      const data = await reviewsAPI.getActiveUsers(fecha_inicio, fecha_fin);
      console.log('👥 Usuarios activos:', data);
      return data;
    } catch (err) {
      console.error('Error fetching active users:', err);
      setError(err.message || 'Error al cargar usuarios activos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== UTILIDADES ==========
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetReviews = useCallback(() => {
    setReviews([]);
    setStats(null);
    setPagination(null);
    setError(null);
  }, []);

  return {
    // Estados
    reviews,
    stats,
    pagination,
    loading,
    error,
    
    // Utilidades
    clearError,
    resetReviews,
    
    // Obtener reviews
    fetchOferenteReviews,
    fetchProductoReviews,
    fetchServicioReviews,
    fetchMyReviews,
    
    // CRUD Reviews
    createReview,
    updateReview,
    deleteReview,
    
    // Respuestas
    createResponse,
    updateResponse,
    deleteResponse,
    
    // Reportes
    reportReview,
    getMyReports,
    
    // Admin
    getPendingReports,
    moderateReview,    // ✅ Agregado
    resolveReport,     // ✅ Agregado
    
    // Admin - Dashboard
    getDashboard,
    getTopOferentes,
    getActiveUsers,
    
    // Estadísticas
    fetchOferenteStats
  };
};