const API_URL = 'http://localhost:5000/api';

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// User API methods
export const usuariosAPI = {
  register: async (userData) => {
    return apiRequest('/usuarios', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getAll: async () => {
    return apiRequest('/usuarios', {
      method: 'GET',
    });
  },

  login: async (credentials) => {
    return apiRequest('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getById: async (id) => {
    return apiRequest(`/usuarios/${id}`, {
      method: 'GET',
    });
  },

  update: async (id, userData) => {
    return apiRequest(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  },
};

// Oferente API methods
export const oferentesAPI = {
  create: async (oferenteData) => {
    return apiRequest('/oferentes', {
      method: 'POST',
      body: JSON.stringify(oferenteData),
    });
  },

  getAll: async () => {
    return apiRequest('/oferentes', {
      method: 'GET',
    });
  },

  getById: async (id) => {
    return apiRequest(`/oferentes/${id}`, {
      method: 'GET',
    });
  },

  getByUserId: async (userId) => {
    return apiRequest(`/oferentes/usuario/${userId}`, {
      method: 'GET',
    });
  },

  update: async (id, oferenteData) => {
    return apiRequest(`/oferentes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(oferenteData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/oferentes/${id}`, {
      method: 'DELETE',
    });
  },
};

// Servicio API methods
export const serviciosAPI = {
  create: async (servicioData) => {
    return apiRequest('/servicios', {
      method: 'POST',
      body: JSON.stringify(servicioData),
    });
  },

  getAll: async () => {
    return apiRequest('/servicios', {
      method: 'GET',
    });
  },

  getById: async (id) => {
    return apiRequest(`/servicios/${id}`, {
      method: 'GET',
    });
  },

  getByOferenteId: async (oferenteId) => {
    return apiRequest(`/servicios/oferente/${oferenteId}`, {
      method: 'GET',
    });
  },

  update: async (id, servicioData) => {
    return apiRequest(`/servicios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(servicioData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/servicios/${id}`, {
      method: 'DELETE',
    });
  },
};

export default usuariosAPI;