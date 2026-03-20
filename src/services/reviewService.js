// src/services/reviewService.js
import { reviewsAPI } from './api';  // Importa reviewsAPI directamente

// ========== REVIEWS ==========
export const reviewService = {
    // Crear review
    createReview: async (reviewData) => {
        try {
            const response = await reviewsAPI.create(reviewData);
            return response;
        } catch (error) {
            console.error('Error in createReview:', error);
            throw error;
        }
    },

    // Obtener mis reviews
    getMyReviews: async (page = 1, limit = 10) => {
        try {
            const response = await reviewsAPI.getMisReviews(page, limit);
            return response;
        } catch (error) {
            console.error('Error in getMyReviews:', error);
            throw error;
        }
    },

    // Obtener reviews de oferente
    getOferenteReviews: async (id_oferente, page = 1, limit = 10, rating = null) => {
        try {
            const response = await reviewsAPI.getOferenteReviews(id_oferente, page, limit, rating);
            return response;
        } catch (error) {
            console.error('Error in getOferenteReviews:', error);
            throw error;
        }
    },

    // Obtener reviews de producto
    getProductoReviews: async (id_producto, page = 1, limit = 10) => {
        try {
            const response = await reviewsAPI.getProductoReviews(id_producto, page, limit);
            return response;
        } catch (error) {
            console.error('Error in getProductoReviews:', error);
            throw error;
        }
    },

    // Obtener reviews de servicio
    getServicioReviews: async (id_servicio, page = 1, limit = 10) => {
        try {
            const response = await reviewsAPI.getServicioReviews(id_servicio, page, limit);
            return response;
        } catch (error) {
            console.error('Error in getServicioReviews:', error);
            throw error;
        }
    },

    // Actualizar review
    updateReview: async (id_review, reviewData) => {
        try {
            const response = await reviewsAPI.update(id_review, reviewData);
            return response;
        } catch (error) {
            console.error('Error in updateReview:', error);
            throw error;
        }
    },

    // Eliminar review
    deleteReview: async (id_review) => {
        try {
            const response = await reviewsAPI.delete(id_review);
            return response;
        } catch (error) {
            console.error('Error in deleteReview:', error);
            throw error;
        }
    },

    // ========== RESPUESTAS ==========
    createResponse: async (id_review, mensaje) => {
        try {
            const response = await reviewsAPI.createResponse(id_review, mensaje);
            return response;
        } catch (error) {
            console.error('Error in createResponse:', error);
            throw error;
        }
    },

    updateResponse: async (id_response, mensaje) => {
        try {
            const response = await reviewsAPI.updateResponse(id_response, mensaje);
            return response;
        } catch (error) {
            console.error('Error in updateResponse:', error);
            throw error;
        }
    },

    deleteResponse: async (id_response) => {
        try {
            const response = await reviewsAPI.deleteResponse(id_response);
            return response;
        } catch (error) {
            console.error('Error in deleteResponse:', error);
            throw error;
        }
    },

    // ========== REPORTES ==========
    reportReview: async (id_review, motivo, comentario) => {
        try {
            const response = await reviewsAPI.report(id_review, motivo, comentario);
            return response;
        } catch (error) {
            console.error('Error in reportReview:', error);
            throw error;
        }
    },

    // ========== ADMIN ==========
    getPendingReports: async (page = 1, limit = 20) => {
        try {
            const response = await reviewsAPI.getPendingReports(page, limit);
            return response;
        } catch (error) {
            console.error('Error in getPendingReports:', error);
            throw error;
        }
    },

    moderateReview: async (id_review, accion) => {
        try {
            const response = await reviewsAPI.moderate(id_review, accion);
            return response;
        } catch (error) {
            console.error('Error in moderateReview:', error);
            throw error;
        }
    },

    resolveReport: async (id_reporte, estado, comentario) => {
        try {
            const response = await reviewsAPI.resolveReport(id_reporte, estado, comentario);
            return response;
        } catch (error) {
            console.error('Error in resolveReport:', error);
            throw error;
        }
    }
};