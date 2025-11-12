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

  getAll: () =>
    apiRequest('/oferentes', {
      method: 'GET',
    }),

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

/* ======================================================
   PRODUCTOS API
====================================================== */
export const productosAPI = {
  getAll: () => apiRequest('/productos/todos'),

  getByTipo: (tipo) => apiRequest(`/productos/tipo/${tipo}`),

  getById: (id) => apiRequest(`/productos/detalle/${id}`),

  getServiciosRestaurante: () => apiRequest('/productos/servicios/restaurante'),

  checkStock: (id, cantidad) =>
    apiRequest(`/productos/stock/${id}?cantidad=${cantidad}`),

  getMisProductos: () =>
    apiRequest('/productos/mis-productos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  create: (productoData) =>
    apiRequest('/productos/crear', {
      method: 'POST',
      body: JSON.stringify(productoData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  update: (id, productoData) =>
    apiRequest(`/productos/actualizar/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productoData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  delete: (id) =>
    apiRequest(`/productos/eliminar/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),

  updateInventario: (id, cantidadData) =>
    apiRequest(`/productos/inventario/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(cantidadData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
};

/* ======================================================
   CATEGORIAS API
====================================================== */
export const categoriasAPI = {
  getAll: () => apiRequest('/categorias'),

  getByTipo: (tipo) => apiRequest(`/categorias/tipo/${tipo}`),

  create: (categoriaData) =>
    apiRequest('/categorias', {
      method: 'POST',
      body: JSON.stringify(categoriaData),
    }),

  update: (id, categoriaData) =>
    apiRequest(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoriaData),
    }),

  delete: (id) =>
    apiRequest(`/categorias/${id}`, {
      method: 'DELETE',
    }),
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
