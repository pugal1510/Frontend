// ==================== src/api/axiosConfig.js ====================
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401, refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;


// ==================== src/api/authApi.js ====================
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  sendOtp: (email) => api.post(`/auth/send-otp?email=${email}`),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
};


// ==================== src/api/productApi.js ====================
export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: (type = 'NEW_ARRIVALS') => api.get(`/products/featured?type=${type}`),
  search: (q, page = 0) => api.get(`/products/search?q=${q}&page=${page}`),
  getCategories: () => api.get('/categories'),
  getReviews: (productId, page = 0) => api.get(`/reviews/product/${productId}?page=${page}`),
  addReview: (data) => api.post('/reviews', data),
};


// ==================== src/api/cartApi.js ====================
export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/add', data),
  updateItem: (data) => api.put('/cart/update', data),
  removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
  clear: () => api.delete('/cart/clear'),
};


// ==================== src/api/orderApi.js ====================
export const orderApi = {
  place: (data) => api.post('/orders/place', data),
  getAll: (page = 0) => api.get(`/orders?page=${page}`),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  requestReturn: (id, reason) => api.post(`/orders/${id}/return`, { reason }),
};


// ==================== src/api/paymentApi.js ====================
export const paymentApi = {
  createOrder: (orderId) => api.post('/payment/create-order', { orderId }),
  verify: (data) => api.post('/payment/verify', data),
};


// ==================== src/api/wishlistApi.js ====================
export const wishlistApi = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/add/${productId}`),
  remove: (productId) => api.delete(`/wishlist/remove/${productId}`),
};


// ==================== src/api/couponApi.js ====================
export const couponApi = {
  apply: (code, orderAmount) => api.post('/coupons/apply', { code, orderAmount }),
};


// ==================== src/api/profileApi.js ====================
export const profileApi = {
  getAddresses: () => api.get('/addresses'),
  addAddress: (data) => api.post('/addresses', data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
};
