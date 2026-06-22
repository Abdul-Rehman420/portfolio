import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: { 
    'Content-Type': 'application/json',
  },
  timeout: 120000,
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
      console.error('API Error Response:', error.response.status, error.response.data);
      
      if (error.response.status === 401 && typeof window !== 'undefined') {
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        if (isAdminRoute && !window.location.pathname.includes('/login')) {
          localStorage.removeItem('admin_token');
          window.location.href = '/admin/login';
        }
      }
    } else if (error.request) {
      console.error('API No Response:', error.request);
      error.message = 'No response from server. Please check your network connection.';
    } else {
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

// Contact - Send message
export const sendContactMessage = (data) => api.post('/contact', data).then(r => r.data);

// Helper function to get image URL with cache busting
export const getImageUrl = (url) => {
  if (!url) return url;
  // If it's a Cloudinary URL, add a cache-busting parameter
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_t=${Date.now()}`;
  }
  // For other URLs, add a timestamp parameter
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

// Upload with retry logic
export const uploadImage = async (file, retries = 3) => {
  const fd = new FormData();
  fd.append('image', file);
  
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const uploadApi = axios.create({
        baseURL: API_BASE,
        timeout: 180000,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        if (token) {
          uploadApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          throw new Error('You must be logged in to upload images');
        }
      }
      
      console.log(`Uploading file: ${file.name}, Size: ${(file.size / 1024).toFixed(2)} KB, Type: ${file.type}`);
      
      const response = await uploadApi.post('/upload', fd);
      console.log('Upload successful:', response.data);
      
      // Return the URL with cache busting already applied
      if (response.data && response.data.url) {
        response.data.url = getImageUrl(response.data.url);
      }
      return response.data;
    } catch (error) {
      lastError = error;
      console.log(`Upload attempt ${attempt}/${retries} failed:`, error.message);
      
      if (error.response) {
        console.error('Server responded with:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received. Check if backend is running at', API_BASE);
      }
      
      if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 408) {
        break;
      }
      
      if (attempt === retries) {
        break;
      }
      
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  if (lastError) {
    if (lastError.response) {
      throw new Error(lastError.response.data?.message || `Server error: ${lastError.response.status}`);
    } else if (lastError.request) {
      throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000.');
    } else {
      throw new Error(lastError.message || 'Upload failed');
    }
  }
  
  throw new Error('Upload failed after multiple attempts');
};

export default api;