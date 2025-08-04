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
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export const fetchAdminInventoryAPI = () => {
  return api.get('/admin/inventory');
};

export const updateInventoryVariantAPI = (productId, variantId, inventoryData) => {
  return api.put(`/admin/inventory/${productId}/${variantId}`, inventoryData);
};

export const bulkUpdateInventoryAPI = (updates) => {
  return api.post('/admin/inventory/bulk-update', { updates });
};

export const fetchLowStockItemsAPI = () => {
  return api.get('/admin/inventory/low-stock');
};

export const fetchInventoryLogsAPI = (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
  if (filters.productId) queryParams.append('productId', filters.productId);
  if (filters.changeType) queryParams.append('changeType', filters.changeType);
  if (filters.user) queryParams.append('user', filters.user);
  
  const queryString = queryParams.toString();
  const url = queryString ? `/admin/inventory/logs?${queryString}` : '/admin/inventory/logs';
  
  return api.get(url);
};

export const reserveInventoryAPI = (reservations) => {
  return api.post('/admin/inventory/reserve', { reservations });
};

export const releaseInventoryAPI = (releases) => {
  return api.post('/admin/inventory/release', { releases });
};