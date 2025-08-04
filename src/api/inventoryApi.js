import axios from 'axios';

// Create axios instance with base URL (reusing the same instance from authApi)
const API_BASE_URL = 'http://localhost:5000';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Inventory API functions
export const fetchInventoryAPI = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  
  const queryString = queryParams.toString();
  const url = queryString ? `/api/inventory?${queryString}` : '/api/inventory';
  
  return api.get(url);
};

export const getInventoryItemAPI = (id) => {
  return api.get(`/api/inventory/${id}`);
};

export const addItemAPI = (item) => {
  return api.post('/api/inventory', item);
};

export const updateItemAPI = (item) => {
  return api.put(`/api/inventory/${item.id}`, item);
};

export const deleteItemAPI = (itemId) => {
  return api.delete(`/api/inventory/${itemId}`);
};