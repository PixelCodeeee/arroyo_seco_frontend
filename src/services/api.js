const API_URL = 'http://localhost:5000/api';

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

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `🔥 Error during ${method} ${endpoint} (${duration}ms):`,
      error.message || error
    );
    console.groupEnd();

    // Optional: send error to external logging service here
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
    }),

  getById: (id) =>
    apiRequest(`/usuarios/${id}`, {
      method: 'GET',
    }),

  update: (id, userData) =>
    apiRequest(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  delete: (id) =>
    apiRequest(`/usuarios/${id}`, {
      method: 'DELETE',
    }),
};

/* ======================================================
   OFERENTES API
====================================================== */
export const oferentesAPI = {
  create: (oferenteData) =>
    apiRequest('/oferentes', {
      method: 'POST',
      body: JSON.stringify(oferenteData),
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
    }),

  updateEstado: (id, estadoData) =>
    apiRequest(`/oferentes/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify(estadoData),
    }),

  delete: (id) =>
    apiRequest(`/oferentes/${id}`, {
      method: 'DELETE',
    }),
};

/* ======================================================
   SERVICIOS API
====================================================== */
export const serviciosAPI = {
  create: (servicioData) =>
    apiRequest('/servicios', {
      method: 'POST',
      body: JSON.stringify(servicioData),
    }),

  getAll: () =>
    apiRequest('/servicios', {
      method: 'GET',
    }),

  getById: (id) =>
    apiRequest(`/servicios/${id}`, {
      method: 'GET',
    }),

  getByOferenteId: (oferenteId) =>
    apiRequest(`/servicios/oferente/${oferenteId}`, {
      method: 'GET',
    }),

  update: (id, servicioData) =>
    apiRequest(`/servicios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(servicioData),
    }),

  delete: (id) =>
    apiRequest(`/servicios/${id}`, {
      method: 'DELETE',
    }),
};

// ---------------------------------------------------------------------
// PRODUCTOS
// ---------------------------------------------------------------------
export const productosAPI = {
  // PUBLIC
  getAll: () => request('/productos'),                     // GET  /api/productos
  getById: (id) => request(`/productos/detalle/${id}`),    // GET  /api/productos/detalle/:id
  getByTipo: (tipo) => request(`/productos/categoria/${tipo}`),

  // OFERENTE (protected – the middleware adds the token)
  getMis: () => request('/productos/mis-productos'),       // GET  /api/productos/mis-productos
  create: (body) => request('/productos/crear', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/productos/actualizar/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/productos/eliminar/${id}`, { method: 'DELETE' }),
  updateInventario: (id, { cantidad }) => request(`/productos/inventario/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ cantidad })
  }),
  checkStock: (id, qty = 1) => request(`/productos/stock/${id}?cantidad=${qty}`)
};

// ---------------------------------------------------------------------
// CATEGORIAS (admin only – you already have a categoriasAPI, just keep the same shape)
// ---------------------------------------------------------------------
export const categoriasAPI = {
  getAll: () => request('/categorias'),                     // GET  /api/categorias
  getById: (id) => request(`/categorias/${id}`),
  create: (body) => request('/categorias', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/categorias/${id}`, { method: 'DELETE' })
};

/* ======================================================
   ORDENES API
====================================================== */
export const ordenesAPI = {
  create: (ordenData) =>
    apiRequest('/ordenes', {
      method: 'POST',
      body: JSON.stringify(ordenData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getMisOrdenes: () =>
    apiRequest('/ordenes/mis-ordenes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  getOrdenesOferente: () =>
    apiRequest('/ordenes/oferente', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  updateEstado: (id, estado) =>
    apiRequest(`/ordenes/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
};

export default usuariosAPI;