import { addPendingOperation, getCache, setCache } from './localDB';

const API_URL = import.meta.env.VITE_API_URL;

// Generic API request handler with full logging
const apiRequest = async (endpoint, options = {}) => {
  const method = options.method || 'GET';
  const startTime = Date.now();

  console.groupCollapsed(`📡 API Request → ${method} ${API_URL}${endpoint}`);
  console.log('Headers:', { ...options.headers, 'Content-Type': 'application/json' });
  if (options.body) {
    try {
      console.log('Body:', JSON.parse(options.body));
    } catch {
      console.log('Body:', options.body);
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-frontend-version': import.meta.env.VITE_FRONTEND_VERSION || 'stable',
        ...options.headers,
      },
      ...options,
    });

    const responseTime = Date.now() - startTime;
    let data;

    try {
      data = await response.json();
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError);
      throw new Error(`Invalid JSON response from ${endpoint}`);
    }

    if (!response.ok) {
      console.error(
        `🚨 Request failed [${response.status} ${response.statusText}] in ${responseTime}ms`,
        '\nResponse body:',
        data
      );
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    console.log(`✅ Success [${response.status}] in ${responseTime}ms`);
    console.log('Response data:', data);
    console.groupEnd();

    // ====== OFFLINE CACHING FOR GET ======
    if (method.toUpperCase() === 'GET') {
      let cacheStore = 'cached_pedidos';
      if (endpoint.includes('/pedidos') || endpoint.includes('/ordenes')) cacheStore = 'cached_pedidos';
      else if (endpoint.includes('/reservas')) cacheStore = 'cached_reservas';
      else if (endpoint.includes('/productos')) cacheStore = 'cached_productos';
      else if (endpoint.includes('/categorias')) cacheStore = 'cached_categorias';
      else if (endpoint.includes('/servicios')) cacheStore = 'cached_servicios';
      else if (endpoint.includes('/usuarios') || endpoint.includes('/oferentes')) cacheStore = 'cached_usuarios';
      else if (endpoint.includes('/announcements')) cacheStore = 'cached_announcements';

      await setCache(cacheStore, endpoint, data).catch(console.warn);
    }
    // =====================================

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `🔥 Error during ${method} ${endpoint} (${duration}ms):`,
      error.message || error
    );
    console.groupEnd();

    // Offline Interceptor
    const isOfflineError = error instanceof TypeError || !navigator.onLine;

    if (isOfflineError) {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
        console.warn('📡 Red desconectada: Saltando error y guardando petición en cola offline para', endpoint);

        let parsedBody = null;
        if (options.body) {
          try {
            parsedBody = JSON.parse(options.body);
          } catch (_) {
            parsedBody = options.body;
          }
        }

        // Save to IndexedDB
        await addPendingOperation({ endpoint, method, body: parsedBody });

        return {
          _offlineQueued: true, // Used by frontend for optimistic indicators
          message: 'Guardado localmente para sincronizar luego'
        };
      } else if (method.toUpperCase() === 'GET') {
        console.warn('📡 Red desconectada: Recuperando datos cacheados para GET', endpoint);
        
        let cacheStore = 'cached_pedidos';
        if (endpoint.includes('/pedidos') || endpoint.includes('/ordenes')) cacheStore = 'cached_pedidos';
        else if (endpoint.includes('/reservas')) cacheStore = 'cached_reservas';
        else if (endpoint.includes('/productos')) cacheStore = 'cached_productos';
        else if (endpoint.includes('/categorias')) cacheStore = 'cached_categorias';
        else if (endpoint.includes('/servicios')) cacheStore = 'cached_servicios';
        else if (endpoint.includes('/usuarios') || endpoint.includes('/oferentes')) cacheStore = 'cached_usuarios';
        else if (endpoint.includes('/announcements')) cacheStore = 'cached_announcements';

        const cachedData = await getCache(cacheStore, endpoint);
        
        if (cachedData) {
          console.log(`📦 Serving cached data for ${endpoint}`);
          // Add a custom marker to signal to the UI that these are offline results
          if (Array.isArray(cachedData)) {
            cachedData._isCache = true; 
          }
          return cachedData;
        } else {
           console.warn(`📦 No offline cache found for ${endpoint}`);
           throw new Error('No hay conexión y no hay datos guardados para mostrar.');
        }
      }
    }

    throw error;
  }
};

/* ======================================================
   USERS API
====================================================== */
export const usuariosAPI = {
  register: (userData) =>
    apiRequest('/usuarios/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  verify2FA: (data) =>
    apiRequest('/usuarios/verify-2fa', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resend2FA: (data) =>
    apiRequest('/usuarios/resend-2fa', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () =>
    apiRequest('/usuarios', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getById: (id) =>
    apiRequest(`/usuarios/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  update: (id, userData) =>
    apiRequest(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  delete: (id) =>
    apiRequest(`/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  forgotPassword: (data) =>
    apiRequest('/usuarios/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data) =>
    apiRequest('/usuarios/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePassword: (id, data) =>
    apiRequest(`/usuarios/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),

  solicitarCambioCorreo: (id, data) =>
    apiRequest(`/usuarios/${id}/cambio-correo/solicitar`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),

  verificarCambioCorreo: (id, data) =>
    apiRequest(`/usuarios/${id}/cambio-correo/verificar`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),

  getPerfil: async () => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) throw new Error('No autenticado');
    const user = JSON.parse(userStr);

    const userData = await apiRequest(`/usuarios/${user.id_usuario}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    if (user.rol === 'oferente') {
      try {
        const response = await apiRequest(`/oferentes/usuario/${user.id_usuario}`, { method: 'GET' });
        const oferenteData = Array.isArray(response) ? response[0] : response;
        if (oferenteData) {
          return { ...userData, telefono: oferenteData.telefono || "", direccion: oferenteData.direccion || "" };
        }
      } catch (err) {
        console.warn("Could not fetch oferente profile data", err);
      }
    }
    return userData;
  },

  actualizarPerfil: async (dataToUpdate) => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) throw new Error('No autenticado');
    const user = JSON.parse(userStr);

    const userData = { nombre: dataToUpdate.nombre, correo: dataToUpdate.correo };

    await apiRequest(`/usuarios/${user.id_usuario}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    if (user.rol === 'oferente' && (dataToUpdate.telefono !== undefined || dataToUpdate.direccion !== undefined)) {
      try {
        const response = await apiRequest(`/oferentes/usuario/${user.id_usuario}`, { method: 'GET' });
        const oferente = Array.isArray(response) ? response[0] : response;
        if (oferente && oferente.id_oferente) {
          await apiRequest(`/oferentes/${oferente.id_oferente}`, {
            method: 'PUT',
            body: JSON.stringify({
              telefono: dataToUpdate.telefono,
              direccion: dataToUpdate.direccion
            }),
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
        }
      } catch (err) {
        console.error("Failed to update oferente profile", err);
      }
    }
    return true;
  }
};

/* ======================================================
   OFERENTES API
====================================================== */
export const oferentesAPI = {
  create: (oferenteData) =>
    apiRequest('/oferentes', {
      method: 'POST',
      body: JSON.stringify(oferenteData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.estado) queryParams.append('estado', filters.estado);
    if (filters.tipo) queryParams.append('tipo', filters.tipo);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/oferentes?${queryString}` : '/oferentes';

    return apiRequest(endpoint, { method: 'GET' });
  },

  getById: (id) =>
    apiRequest(`/oferentes/${id}`, {
      method: 'GET',
    }),

  getByUserId: (userId) =>
    apiRequest(`/oferentes/usuario/${userId}`, {
      method: 'GET',
    }),

  update: (id, oferenteData) =>
    apiRequest(`/oferentes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(oferenteData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  updateEstado: (id, estadoData) =>
    apiRequest(`/oferentes/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify(estadoData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  delete: (id) =>
    apiRequest(`/oferentes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
};

/* ======================================================
   SERVICIOS API
====================================================== */
export const serviciosAPI = {
  create: (data) =>
    apiRequest('/servicios', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getAll: () =>
    apiRequest('/servicios'),

  getById: (id) =>
    apiRequest(`/servicios/${id}`),

  getByOferenteId: (oferenteId) =>
    apiRequest(`/servicios/oferente/${oferenteId}`),

  update: (id, data) =>
    apiRequest(`/servicios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  delete: (id) =>
    apiRequest(`/servicios/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
};

// ---------------------------------------------------------------------
// PRODUCTOS
// ---------------------------------------------------------------------
export const productosAPI = {
  getByOferenteId: (oferenteId) =>
    apiRequest(`/productos/oferente/${oferenteId}`),
  getAll: () => apiRequest('/productos'),
  getMis: () => apiRequest('/productos/mis-productos', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  create: (data) => apiRequest('/productos', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  update: (id, data) => apiRequest(`/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  delete: (id) => apiRequest(`/productos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  getCategorias: () => apiRequest('/categorias'),
  crearCategoria: (data) => apiRequest('/categorias', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  actualizarCategoria: (id, data) => apiRequest(`/categorias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  eliminarCategoria: (id) => apiRequest(`/categorias/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
};

/* ======================================================
   PEDIDOS (ORDERS) API
====================================================== */
export const pedidosAPI = {
  create: (pedidoData) =>
    apiRequest('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedidoData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getAll: () =>
    apiRequest('/pedidos', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getById: (id) =>
    apiRequest(`/pedidos/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getMisPedidos: () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) throw new Error('Usuario no autenticado');

    return apiRequest(`/pedidos/usuario/${currentUser.id_usuario}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  getByUsuarioId: (usuarioId) =>
    apiRequest(`/pedidos/usuario/${usuarioId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getByOferenteId: (oferenteId) =>
    apiRequest(`/pedidos/oferente/${oferenteId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getByEstado: (estado) =>
    apiRequest(`/pedidos/estado/${estado}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  updateEstado: (id, estado) =>
    apiRequest(`/pedidos/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  delete: (id) =>
    apiRequest(`/pedidos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
};

// Deprecated alias for backward compatibility
export const ordenesAPI = pedidosAPI;

/* ======================================================
   RESERVAS API
====================================================== */
export const reservasAPI = {
  create: (reservaData) =>
    apiRequest('/reservas', {
      method: 'POST',
      body: JSON.stringify(reservaData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getAll: () =>
    apiRequest('/reservas', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getById: (id) =>
    apiRequest(`/reservas/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getByUsuarioId: (usuarioId) =>
    apiRequest(`/reservas/usuario/${usuarioId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  // In reservasAPI object, add this method:

  getMisReservas: () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) throw new Error("Usuario no autenticado");

    return apiRequest(`/reservas/usuario/${currentUser.id_usuario}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
  // Add this to reservasAPI in api.js:
  getMisReservasComoOferente: async () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) throw new Error("Usuario no autenticado");

    const oferenteData = await oferentesAPI.getByUserId(currentUser.id_usuario);
    const id_oferente = oferenteData?.id_oferente ?? oferenteData?.oferente?.id_oferente;
    if (!id_oferente) throw new Error("No se encontró el perfil de oferente");

    return apiRequest(`/reservas/oferente/${id_oferente}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  getByServicioId: (servicioId) =>
    apiRequest(`/reservas/servicio/${servicioId}`),

  getByOferenteId: (oferenteId) =>
    apiRequest(`/reservas/oferente/${oferenteId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getByEstado: (estado) =>
    apiRequest(`/reservas/estado/${estado}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  update: (id, reservaData) =>
    apiRequest(`/reservas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservaData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  updateEstado: (id, estado) =>
    apiRequest(`/reservas/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  checkDisponibilidad: (id_servicio, fecha, hora) => {
    const params = new URLSearchParams({ id_servicio, fecha, hora });
    return apiRequest(`/reservas/disponibilidad?${params.toString()}`, {
      method: 'GET',
    });
  },

  delete: (id) =>
    apiRequest(`/reservas/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  cancelar: async (id) => {
    const reserva = await apiRequest(`/reservas/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const fechaReserva = new Date(`${reserva.fecha}T${reserva.hora}`);
    const ahora = new Date();
    const horasRestantes = (fechaReserva - ahora) / (1000 * 60 * 60);

    if (horasRestantes < 24) {
      throw new Error('No se puede cancelar con menos de 24 horas de anticipación');
    }

    return apiRequest(`/reservas/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: 'cancelada' }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};

/* ======================================================
   MERCADOPAGO OFERENTE API
   (OAuth para que el oferente conecte su cuenta de MP)
====================================================== */
export const mercadopagoAPI = {

  // Crear preferencia de pago (carrito)
  createOrder: (orderData) =>
    apiRequest('/mercadopago/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // Confirmar pago después del redirect
  captureOrder: (captureData) =>
    apiRequest('/mercadopago/capture-order', {
      method: 'POST',
      body: JSON.stringify(captureData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  // Detalle de un pago
  getOrderDetails: (orderID) =>
    apiRequest(`/mercadopago/orders/${orderID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  // Obtener URL de autorización OAuth (redirige a MP)
  getOAuthUrl: () =>
    apiRequest('/mercadopago/mp/oauth-url', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  // Consultar estado de conexión del oferente con MP
  getEstado: () =>
    apiRequest('/mercadopago/mp/estado', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
};
/* ======================================================
   ANNOUNCEMENTS API
====================================================== */
export const announcementsAPI = {
  getMaintenance: () =>
    apiRequest('/announcements/maintenance'),

  getAll: () =>
    apiRequest('/announcements'),

  getById: (id) =>
    apiRequest(`/announcements/${id}`),

  create: (data) =>
    apiRequest('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  update: (id, data) =>
    apiRequest(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  delete: (id) =>
    apiRequest(`/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
};

export default usuariosAPI;