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
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin && admin.token) {
      config.headers.Authorization = `Bearer ${admin.token}`;
      console.log('[API] Sending Authorization header:', config.headers.Authorization);
    } else {
      console.warn('[API] No token found in localStorage for request:', config.url);
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
      console.error('[API] 401 Unauthorized - logging out and redirecting to login.');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getDashboardSummaryAPI = async () => {
  try {

    const response = await api.get('/api/admin/dashboard');
    if (response && response.data) {
      return { data: response.data };
    }
  } catch (error) {
    
    if (error.response && error.response.status === 404) {
      try {
        const [productsResponse, inventoryResponse, ordersResponse] = await Promise.all([
          api.get('/api/admin/products', { params: { limit: 1000 } }),
          api.get('/api/admin/inventory/low-stock'),
          api.get('/api/admin/orders', { params: { limit: 1000 } })
        ]);

        const products = productsResponse.data.products || productsResponse.data || [];
        const lowStockItems = inventoryResponse.data.items || inventoryResponse.data || [];
        const orders = ordersResponse.data.orders || ordersResponse.data || [];

        const totalItems = products.length;
        const lowStockCount = lowStockItems.length;
        const totalQuantity = products.reduce((sum, product) => {
          if (product.variants && product.variants.length > 0) {
            return sum + product.variants.reduce((variantSum, variant) =>
              variantSum + (variant.quantity || 0), 0);
          }
          return sum + (product.quantity || 0);
        }, 0);
        const totalValue = products.reduce((sum, product) => {
          if (product.variants && product.variants.length > 0) {
            return sum + product.variants.reduce((variantSum, variant) =>
              variantSum + ((variant.quantity || 0) * (variant.price || product.price || 0)), 0);
          }
          return sum + ((product.quantity || 0) * (product.price || 0));
        }, 0);
        const totalRevenue = orders
          .filter(order => order.status === 'delivered' || order.status === 'completed')
          .reduce((sum, order) => sum + (order.total || 0), 0);

        return {
          data: {
            totalItems,
            lowStockCount,
            totalQuantity,
            totalValue,
            totalRevenue
          }
        };
      } catch (aggError) {
        console.error('Dashboard summary aggregation error:', aggError);
        throw aggError;
      }
    } else {
      console.error('Dashboard summary fetch error:', error);
      throw error;
    }
  }
}; 