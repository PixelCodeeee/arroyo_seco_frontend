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
  // Register new user
  register: async (userData) => {
    return apiRequest('/usuarios', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get all users
  getAll: async () => {
    return apiRequest('/usuarios', {
      method: 'GET',
    });
  },

    // User login
  login: async (credentials) => {
    return apiRequest('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get user by ID
  getById: async (id) => {
    return apiRequest(`/usuarios/${id}`, {
      method: 'GET',
    });
  },

  // Update user
  update: async (id, userData) => {
    return apiRequest(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  delete: async (id) => {
    return apiRequest(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  },
};

export default usuariosAPI;