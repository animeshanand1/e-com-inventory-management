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
    console.log('Axios request interceptor - URL:', config.url);
    console.log('Axios request interceptor - Full URL:', `${config.baseURL}${config.url}`);
    
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin && admin.token) {
      config.headers.Authorization = `Bearer ${admin.token}`;
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
      localStorage.removeItem('admin');
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
  const url = queryString ? `/api/admin/inventory?${queryString}` : '/api/admin/inventory';
  
  return api.get(url);
};

export const getInventoryItemAPI = (id) => {
  return api.get(`/api/admin/inventory/${id}`);
};

export const addItemAPI = (item) => {
  return api.post('/api/admin/products', item);
};

export const updateItemAPI = (item) => {
  console.log('updateItemAPI called with item:', item);
  console.log('productId:', item.productId);
  console.log('variantId:', item.variantId);
  
  if (item.productId && item.variantId) {
    const url = `/api/admin/inventory/${item.productId}/${item.variantId}`;
    console.log('Constructed URL:', url);
    console.log('Full URL will be:', `http://localhost:5000${url}`);
    
    const payload = {
      
      quantity: item.variants && item.variants[0] ? item.variants[0].inventory.quantity : 0,
    
      price: item.pricing ? item.pricing.basePrice : 0,
      salePrice: item.pricing ? item.pricing.salePrice : 0,
     
      sku: item.variants && item.variants[0] ? item.variants[0].sku : '',
      lowStockThreshold: item.variants && item.variants[0] ? item.variants[0].inventory.lowStockThreshold : 0,
      reserved: item.variants && item.variants[0] ? item.variants[0].inventory.reserved : 0,
      trackInventory: item.variants && item.variants[0] ? item.variants[0].inventory.trackInventory : true,
      
      size: item.variants && item.variants[0] && item.variants[0].attributes ? item.variants[0].attributes.size : '',
      color: item.variants && item.variants[0] && item.variants[0].attributes ? item.variants[0].attributes.color : {},
      
      name: item.name,
      description: item.description,
      brand: item.brand,
      category: item.category,
      status: item.status
    };
    
    console.log('Request payload (formatted for backend):', payload);
    console.log('Payload quantity type:', typeof payload.quantity);
    console.log('Payload price type:', typeof payload.price);
    console.log('Payload salePrice type:', typeof payload.salePrice);
    
    return api.put(url, payload);
  } else if (item.productId || item._id || item.id) {
    const productId = item.productId || item._id || item.id;
    const url = `/api/admin/inventory/${productId}`;
    console.log('Constructed URL (product only):', url);
    
    const payload = { ...item };
    delete payload.productId;
    delete payload._id;
    delete payload.id;
    console.log('Request payload (product only):', payload);
    
    return api.put(url, payload);
  } else {
    throw new Error('Missing product ID for update operation');
  }
};

export const deleteItemAPI = (itemId) => {
  return api.delete(`/api/admin/inventory/${itemId}`);
};

export const fetchAdminInventoryAPI = () => {
  return api.get('/api/admin/inventory');
};

export const updateInventoryVariantAPI = (productId, variantId, inventoryData) => {
  return api.put(`/api/admin/inventory/${productId}/${variantId}`, inventoryData);
};

export const bulkUpdateInventoryAPI = (updates) => {
  return api.post('/api/admin/inventory/bulk-update', { updates });
};

export const fetchLowStockItemsAPI = () => {
  return api.get('/api/admin/inventory/low-stock');
};

export const fetchInventoryLogsAPI = (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
  if (filters.productId) queryParams.append('productId', filters.productId);
  if (filters.changeType) queryParams.append('changeType', filters.changeType);
  if (filters.user) queryParams.append('user', filters.user);
  
  const queryString = queryParams.toString();
  const url = queryString ? `/api/admin/inventory/logs?${queryString}` : '/api/admin/inventory/logs';
  
  return api.get(url);
};

export const reserveInventoryAPI = (reservations) => {
  return api.post('/api/admin/inventory/reserve', { reservations });
};

export const releaseInventoryAPI = (releases) => {
  return api.post('/api/admin/inventory/release', { releases });
};