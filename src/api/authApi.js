import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.config?.url !== '/api/admin/login'
    ) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginAPI = (credentials) => {
  return api.post('/api/admin/login', credentials);
};

export const getCurrentUserAPI = () => {
  return api.get('/api/admin/me');
};

export const logoutAPI = () => {
  return api.post('/api/admin/logout');
};