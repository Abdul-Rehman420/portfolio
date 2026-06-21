import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: { 
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401 && typeof window !== 'undefined') {
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        if (isAdminRoute && !window.location.pathname.includes('/login')) {
          localStorage.removeItem('admin_token');
          window.location.href = '/admin/login';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      error.message = 'No response from server. Please check your network connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginAdmin = (data) => api.post('/auth/login', data).then(r => r.data);
export const verifyToken = () => api.get('/auth/verify').then(r => r.data);

// Generic CRUD helpers
export const fetchAll = (endpoint) => api.get(`/${endpoint}`).then(r => r.data);
export const fetchById = (endpoint, id) => api.get(`/${endpoint}/${id}`).then(r => r.data);
export const createItem = (endpoint, data) => api.post(`/${endpoint}`, data).then(r => r.data);
export const updateItem = (endpoint, id, data) => api.put(`/${endpoint}/${id}`, data).then(r => r.data);
export const deleteItem = (endpoint, id) => api.delete(`/${endpoint}/${id}`).then(r => r.data);

// Upload
export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post('/upload', fd, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  }).then(r => r.data);
};

export default api;