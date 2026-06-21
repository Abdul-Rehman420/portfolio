import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: { 
    'Content-Type': 'application/json',
  },
  timeout: 120000, // Increase timeout to 120 seconds (2 minutes)
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

// Upload with retry logic and progress tracking
export const uploadImage = async (file, retries = 3) => {
  const fd = new FormData();
  fd.append('image', file);
  
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Create a separate axios instance with longer timeout for uploads
      const uploadApi = axios.create({
        baseURL: API_BASE,
        timeout: 180000, // 3 minutes for uploads
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Add auth token
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        if (token) {
          uploadApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await uploadApi.post('/upload', fd);
      return response.data;
    } catch (error) {
      lastError = error;
      console.log(`Upload attempt ${attempt}/${retries} failed:`, error.message);
      
      // Don't retry if it's a client error (4xx) except for timeout (408)
      if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 408) {
        break;
      }
      
      // Don't retry if it's a network error and we've reached the last attempt
      if (attempt === retries) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Throw the last error with a meaningful message
  if (lastError) {
    if (lastError.response) {
      throw new Error(lastError.response.data?.message || `Server error: ${lastError.response.status}`);
    } else if (lastError.request) {
      throw new Error('No response from server. Please check your network connection.');
    } else {
      throw new Error(lastError.message || 'Upload failed');
    }
  }
  
  throw new Error('Upload failed after multiple attempts');
};

export default api;