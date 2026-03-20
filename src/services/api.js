// src/services/api.js

// Bases de cada microservicio
const API_URL_AUTH = import.meta.env.VITE_API_URL_AUTH;
const API_URL_CATALOG = import.meta.env.VITE_API_URL_CATALOG;
const API_URL_ORDERS = import.meta.env.VITE_API_URL_ORDERS;
const API_URL_RESERVATIONS = import.meta.env.VITE_API_URL_RESERVATIONS;
const API_URL_PAYMENTS = import.meta.env.VITE_API_URL_PAYMENTS;
const API_URL_REVIEWS = import.meta.env.VITE_API_URL_REVIEWS || 'http://localhost:5007';

// Generic API request handler
const apiRequest = async (baseUrl, endpoint, options = {}) => {
  const method = options.method || 'GET';
  const startTime = Date.now();

  let body = options.body;
  if (body && typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  console.groupCollapsed(`📡 API Request → ${method} ${baseUrl}${endpoint}`);
  console.log('Headers:', headers);
  if (body) {
    try { 
      console.log('Body:', JSON.parse(body)); 
    } catch { 
      console.log('Body:', body); 
    }
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers,
      body,
      ...options,
    });

    const responseTime = Date.now() - startTime;
    let data;
    try { 
      data = await response.json(); 
    } catch { 
      throw new Error(`Invalid JSON response from ${endpoint}`); 
    }

    if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);

    console.log(`✅ Success [${response.status}] in ${responseTime}ms`);
    console.log('Response data:', data);
    console.groupEnd();
    return data;
  } catch (error) {
    console.error(`🔥 Error during ${method} ${endpoint}:`, error.message || error);
    console.groupEnd();
    throw error;
  }
};

/* ======================
   USERS API (Auth Service - puerto 5001)
====================== */
export const usuariosAPI = {
  register: (data) => apiRequest(API_URL_AUTH, '/api/usuarios/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiRequest(API_URL_AUTH, '/api/usuarios/login', { method: 'POST', body: JSON.stringify(data) }),
  verify2FA: (data) => apiRequest(API_URL_AUTH, '/api/usuarios/verify-2fa', { method: 'POST', body: JSON.stringify(data) }),
  getAll: (params = {}) => {
    const queryString = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(API_URL_AUTH, `/api/usuarios${queryString}`, { 
      method: 'GET', 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    });
  },
  getById: (id) => apiRequest(API_URL_AUTH, `/api/usuarios/${id}`, { 
    method: 'GET', 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
};

/* ======================
   OFERENTES API (Catalog Service - puerto 5002)
====================== */
export const oferentesAPI = {
  getAll: (params = {}) => {
    // Siempre filtrar solo aprobados si no se pasa otro estado
    if (!params.estado) params.estado = 'aprobado';

    const queryString = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(API_URL_CATALOG, `/api/oferentes${queryString}`);
  },
  getById: (id) => apiRequest(API_URL_CATALOG, `/api/oferentes/${id}`),
  create: (data) => apiRequest(API_URL_CATALOG, '/api/oferentes', { 
    method: 'POST', 
    body: JSON.stringify(data), 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
  update: (id, data) => apiRequest(API_URL_CATALOG, `/api/oferentes/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data), 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
  delete: (id) => apiRequest(API_URL_CATALOG, `/api/oferentes/${id}`, { 
    method: 'DELETE', 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  })
};

/* ======================
   SERVICIOS API (Catalog Service - puerto 5002)
====================== */
export const serviciosAPI = {
  getAll: (params = {}) => {
    const queryString = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(API_URL_CATALOG, `/api/servicios${queryString}`);
  },
  getById: (id) => apiRequest(API_URL_CATALOG, `/api/servicios/${id}`),
  create: (data) => apiRequest(API_URL_CATALOG, '/api/servicios', { 
    method: 'POST', 
    body: JSON.stringify(data), 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
  update: (id, data) => apiRequest(API_URL_CATALOG, `/api/servicios/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data), 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
  delete: (id) => apiRequest(API_URL_CATALOG, `/api/servicios/${id}`, { 
    method: 'DELETE', 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
};

/* ======================
   PRODUCTOS API (Catalog Service - puerto 5002)
====================== */
export const productosAPI = {
  getAll: (params = {}) => {
    const queryString = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(API_URL_CATALOG, `/api/productos${queryString}`);
  },
  getByOferenteId: (id, params = {}) => {
    const queryString = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(API_URL_CATALOG, `/api/productos/oferente/${id}${queryString}`);
  },
  create: (data) => apiRequest(API_URL_CATALOG, '/api/productos', { 
    method: 'POST', 
    body: JSON.stringify(data), 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
  update: (id, data) => apiRequest(API_URL_CATALOG, `/api/productos/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data), 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
  delete: (id) => apiRequest(API_URL_CATALOG, `/api/productos/${id}`, { 
    method: 'DELETE', 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
  getCategorias: () => apiRequest(API_URL_CATALOG, '/api/categorias'),
};

/* ======================
   ORDERS API (Order Service - puerto 5003)
====================== */
export const pedidosAPI = {
  getAll: () => apiRequest(API_URL_ORDERS, '/api/pedidos', { 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  getById: (id) => apiRequest(API_URL_ORDERS, `/api/pedidos/${id}`, { 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  updateEstado: (id, estado) => apiRequest(API_URL_ORDERS, `/api/pedidos/${id}/estado`, { 
    method: 'PUT',
    body: JSON.stringify({ estado }),
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  create: (data) => apiRequest(API_URL_ORDERS, '/api/pedidos', { 
    method: 'POST', 
    body: JSON.stringify(data), 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
  getMisPedidos: () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return apiRequest(API_URL_ORDERS, `/api/pedidos/usuario/${user.id_usuario}`, { 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    });
  },
};

/* ======================
   RESERVATIONS API (Reservation Service - puerto 5004)
====================== */
export const reservasAPI = {
  getAll: () => apiRequest(API_URL_RESERVATIONS, '/api/reservas', { 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  getById: (id) => apiRequest(API_URL_RESERVATIONS, `/api/reservas/${id}`, { 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  updateEstado: (id, estado) => apiRequest(API_URL_RESERVATIONS, `/api/reservas/${id}/estado`, { 
    method: 'PUT',
    body: JSON.stringify({ estado }),
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  create: (data) => apiRequest(API_URL_RESERVATIONS, '/api/reservas', { 
    method: 'POST', 
    body: JSON.stringify(data), 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
  getMisReservas: () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return apiRequest(API_URL_RESERVATIONS, `/api/reservas/usuario/${user.id_usuario}`, { 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    });
  },
};

/* ======================
   PAYMENTS API (Payment Service - puerto 5005)
====================== */
export const paypalAPI = {
  createOrder: (data) => apiRequest(API_URL_PAYMENTS, '/api/paypal/create-order', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  captureOrder: (data) => apiRequest(API_URL_PAYMENTS, '/api/paypal/capture-order', { 
    method: 'POST', 
    body: JSON.stringify(data), 
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
  }),
};

/* ======================
   REVIEWS API (Review Service - puerto 5006) - VERSIÓN FINAL CORREGIDA
====================== */
export const reviewsAPI = {
  // ========== REVIEWS (TODOS LOS USUARIOS) ==========
  
  /**
   * POST /api/reviews
   * Turista: Crear nueva reseña
   */
  create: async (data) => {
    const token = localStorage.getItem('token');
    
    console.log('📝 ReviewsAPI - Creando review:', data);
    
    // El backend espera: id_oferente, rating, comentario (opcional: id_pedido, id_reserva, compra_verificada)
    const reviewData = {
      id_oferente: Number(data.id_oferente),
      rating: Number(data.rating),
      comentario: data.comentario?.trim() || ''
    };
    
    // Si viene de una compra verificada
    if (data.id_pedido) reviewData.id_pedido = data.id_pedido;
    if (data.id_reserva) reviewData.id_reserva = data.id_reserva;
    if (data.compra_verificada) reviewData.compra_verificada = true;

    const response = await fetch(`${API_URL_REVIEWS}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(reviewData)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('❌ ReviewsAPI - Error:', responseData);
      throw new Error(responseData.error || 'Error al crear review');
    }
    
    return responseData;

    
  },

  /**
   * GET /api/reviews/mis-reviews
   * Turista: Ver mis propias reseñas
   */
  getMisReviews: async (page = 1, limit = 10) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL_REVIEWS}/api/reviews/mis-reviews?page=${page}&limit=${limit}`, 
      {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      }
    );
    if (!response.ok) throw new Error('Error al obtener reviews');
    return response.json();
  },

  /**
   * PUT /api/reviews/:id
   * Turista: Actualizar mi reseña
   */
  update: async (id_review, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL_REVIEWS}/api/reviews/${id_review}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({
        rating: data.rating,
        comentario: data.comentario
      })
    });
    return response.json();
  },

  /**
   * DELETE /api/reviews/:id
   * Turista/Admin: Eliminar reseña
   */
  delete: async (id_review) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL_REVIEWS}/api/reviews/${id_review}`, {
      method: 'DELETE',
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.json();
  },

  /**
   * GET /api/reviews/oferente/:id_oferente
   * Público/Autenticado: Ver reseñas de un oferente
   */
  getOferenteReviews: async (id_oferente, page = 1, limit = 10, rating = null) => {
    let url = `${API_URL_REVIEWS}/api/reviews/oferente/${id_oferente}?page=${page}&limit=${limit}`;
    if (rating) url += `&rating=${rating}`;
    
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.json();
  },

  // ========== RESPUESTAS (OFERENTE) ==========
  
  /**
   * POST /api/responses/review/:id_review
   * Oferente: Responder a una reseña
   */
  createResponse: async (id_review, mensaje) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL_REVIEWS}/api/responses/review/${id_review}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ mensaje })
    });
    return response.json();
  },
  // ========== REPORTES (TURISTA Y OFERENTE) ==========
  
  /**
   * POST /api/reports/review/:id_review
   * Turista/Oferente: Reportar una reseña
   */
  // En src/services/api.js, modifica la función report:

report: async (id_review, motivo) => {
  const token = localStorage.getItem('token');
  
  // 🔍 LOGS DE DEBUG
  console.log('🔍 ReportsAPI.report llamado con:', { id_review, motivo });
  console.log('🔍 Token existe:', !!token);
  console.log('🔍 API_URL_REVIEWS:', API_URL_REVIEWS);
  
  const url = `${API_URL_REVIEWS}/api/reports/review/${id_review}`;
  const body = JSON.stringify({ motivo });
  
  console.log('🔍 URL:', url);
  console.log('🔍 Body a enviar:', body);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: body  // ← Asegurar que sea el stringify
  });
  
  console.log('🔍 Response status:', response.status);
  
  const responseData = await response.json();
  console.log('🔍 Response data:', responseData);
  
  if (!response.ok) {
    throw new Error(responseData.error || 'Error al reportar review');
  }
  
  return responseData;
},

  /**
   * GET /api/reports/mis-reportes
   * Turista/Oferente: Ver mis reportes
   */
  getMyReports: async (page = 1, limit = 20) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
        `${API_URL_REVIEWS}/api/reports/mis-reportes?page=${page}&limit=${limit}`,
        { headers: { 'Authorization': token ? `Bearer ${token}` : '' } }
    );
    
    const data = await response.json();
    console.log('📡 API getMyReports response:', data);
    
    if (!response.ok) {
        throw new Error(data.error || 'Error al cargar reportes');
    }
    
    return data;
},
  // ========== ADMIN - REPORTES ==========
  
  /**
   * GET /api/admin/reports/pending
   * Admin: Ver reportes pendientes
   */
  
getPendingReports: async (page = 1, limit = 20) => {
    const token = localStorage.getItem('token');
    
    console.log('🔍 getPendingReports - Token existe:', !!token);
    console.log('🔍 URL:', `${API_URL_REVIEWS}/api/admin/reports/pending?page=${page}&limit=${limit}`);
    
    try {
        const response = await fetch(
            `${API_URL_REVIEWS}/api/admin/reports/pending?page=${page}&limit=${limit}`,
            { 
                headers: { 
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                } 
            }
        );
        
        console.log('🔍 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('🔍 Error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📡 API getPendingReports response:', data);
        return data;
    } catch (error) {
        console.error('❌ Error en getPendingReports:', error);
        throw error;
    }
},

  /**
   * GET /api/reports/review/:id
   * Admin: Ver detalle de un reporte
   */
  getReportDetail: async (id_reporte) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL_REVIEWS}/api/reports/review/${id_reporte}`,
      { headers: { 'Authorization': token ? `Bearer ${token}` : '' } }
    );
    return response.json();
  },

  /**
   * PUT /api/admin/reviews/:id/moderate
   * Admin: Moderar una reseña (hide, unhide, delete)
   */
  moderateReview: async (id_review, accion) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL_REVIEWS}/api/admin/reviews/${id_review}/moderate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ accion })
    });
    return response.json();
  },

  /**
   * PUT /api/reports/review/:id_reporte/resolver
   * Admin: Resolver un reporte
   */
  resolveReport: async (id_reporte) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL_REVIEWS}/api/reports/review/${id_reporte}/resolver`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ estado: 'resuelto' })
    });
    return response.json();
  },

  /**
   * PUT /api/reports/review/:id_review/hide
   * Admin: Ocultar una review desde un reporte
   */
  hideReview: async (id_review) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL_REVIEWS}/api/reports/review/${id_review}/hide`, {
      method: 'PUT',
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.json();
  },

  // ========== ADMIN - DASHBOARD ==========
  
  /**
   * GET /api/admin/dashboard
   * Admin: Ver dashboard con estadísticas
   */
  getDashboard: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL_REVIEWS}/api/admin/dashboard`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.json();
  },

  /**
   * GET /api/admin/top-oferentes
   * Admin: Ver top oferentes por calificación
   */
  getTopOferentes: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL_REVIEWS}/api/admin/top-oferentes`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.json();
  },

  /**
   * GET /api/admin/usuarios-activos
   * Admin: Ver usuarios más activos
   */
  getActiveUsers: async (fecha_inicio, fecha_fin) => {
    const token = localStorage.getItem('token');
    let url = `${API_URL_REVIEWS}/api/admin/usuarios-activos`;
    const params = new URLSearchParams();
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.json();
  },

  // ========== ESTADÍSTICAS (PÚBLICAS/AUTENTICADAS) ==========

/**
 * GET /api/stats/oferente/:id_oferente
 * Ver estadísticas de un oferente
 */
getOferenteStats: async (id_oferente) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL_REVIEWS}/api/stats/oferente/${id_oferente}`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  return response.json();
},

/**
 * GET /api/stats/recent?limit=10
 * Ver reseñas recientes
 */
getRecentReviews: async (limit = 10) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL_REVIEWS}/api/stats/recent?limit=${limit}`, {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  return response.json();
},


};

// Export default para compatibilidad
export default usuariosAPI;