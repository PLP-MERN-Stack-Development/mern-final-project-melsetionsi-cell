import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

export const workoutsAPI = {
  getAll: () => api.get('/workouts'),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (workoutData) => api.post('/workouts', workoutData),
  update: (id, workoutData) => api.put(`/workouts/${id}`, workoutData),
  delete: (id) => api.delete(`/workouts/${id}`),
  getStats: () => api.get('/workouts/stats/summary'),
};

export const nutritionAPI = {
  getAll: (params = {}) => api.get('/nutrition', { params }),
  getById: (id) => api.get(`/nutrition/${id}`),
  create: (nutritionData) => api.post('/nutrition', nutritionData),
  update: (id, nutritionData) => api.put(`/nutrition/${id}`, nutritionData),
  delete: (id) => api.delete(`/nutrition/${id}`),
  getStats: (params = {}) => api.get('/nutrition/stats/summary', { params }),
};

export const healthMetricsAPI = {
  getAll: (params = {}) => api.get('/health-metrics', { params }),
  getById: (id) => api.get(`/health-metrics/${id}`),
  create: (metricData) => api.post('/health-metrics', metricData),
  update: (id, metricData) => api.put(`/health-metrics/${id}`, metricData),
  delete: (id) => api.delete(`/health-metrics/${id}`),
  getTrends: (params = {}) => api.get('/health-metrics/stats/trends', { params }),
};

export default api;
