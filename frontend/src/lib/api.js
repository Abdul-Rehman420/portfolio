import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      if (isAdminRoute && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
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
  return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};

export default api;
