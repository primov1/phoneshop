import api from './axios'

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: object) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

// Users
export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: object) => api.patch(`/users/${id}`, data),
  remove: (id: number) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
}

// Shops
export const shopsApi = {
  getAll: () => api.get('/shops'),
  getOne: (id: number) => api.get(`/shops/${id}`),
  create: (data: object) => api.post('/shops', data),
  update: (id: number, data: object) => api.patch(`/shops/${id}`, data),
  remove: (id: number) => api.delete(`/shops/${id}`),
  getDashboard: () => api.get('/shops/dashboard'),
}

// Masters
export const mastersApi = {
  getAll: () => api.get('/masters'),
  getOne: (id: number) => api.get(`/masters/${id}`),
  create: (data: object) => api.post('/masters', data),
  update: (id: number, data: object) => api.patch(`/masters/${id}`, data),
  remove: (id: number) => api.delete(`/masters/${id}`),
  getDashboard: () => api.get('/masters/dashboard'),
}

// Products
export const productsApi = {
  getAll: (params?: { type?: string; shopId?: number }) => api.get('/products', { params }),
  getOne: (id: number) => api.get(`/products/${id}`),
  create: (data: object) => api.post('/products', data),
  update: (id: number, data: object) => api.patch(`/products/${id}`, data),
  remove: (id: number) => api.delete(`/products/${id}`),
  search: (q: string) => api.get('/products/search', { params: { q } }),
  getShopProducts: (shopId: number) => api.get(`/products/shop/${shopId}`),
}

// Services
export const servicesApi = {
  getAll: (masterId?: number) => api.get('/services', { params: masterId ? { masterId } : {} }),
  getOne: (id: number) => api.get(`/services/${id}`),
  getMy: () => api.get('/services/my'),
  create: (data: object) => api.post('/services', data),
  update: (id: number, data: object) => api.patch(`/services/${id}`, data),
  remove: (id: number) => api.delete(`/services/${id}`),
}

// Orders
export const ordersApi = {
  getAll: () => api.get('/orders'),
  getMy: () => api.get('/orders/my'),
  getOne: (id: number) => api.get(`/orders/${id}`),
  create: (data: object) => api.post('/orders', data),
  updateStatus: (id: number, status: string) => api.patch(`/orders/${id}/status`, { status }),
  getStats: () => api.get('/orders/stats'),
}

// Repairs
export const repairsApi = {
  getAll: () => api.get('/repairs'),
  getOne: (id: number) => api.get(`/repairs/${id}`),
  getProgress: (id: number) => api.get(`/repairs/${id}/progress`),
  getByOrder: (orderId: number) => api.get(`/repairs/order/${orderId}`),
  advance: (id: number, data: object) => api.patch(`/repairs/${id}/advance`, data),
}

// Reviews
export const reviewsApi = {
  getByMaster: (masterId: number) => api.get(`/reviews/master/${masterId}`),
  create: (data: object) => api.post('/reviews', data),
  remove: (id: number) => api.delete(`/reviews/${id}`),
}

// Promo
export const promoApi = {
  getAll: () => api.get('/promo'),
  create: (data: object) => api.post('/promo', data),
  apply: (code: string, amount: number) => api.post('/promo/apply', { code, amount }),
  toggle: (id: number) => api.patch(`/promo/${id}/toggle`),
  remove: (id: number) => api.delete(`/promo/${id}`),
}

// Cart
export const cartApi = {
  get: () => api.get('/cart'),
  add: (productId: number, quantity: number) => api.post('/cart', { productId, quantity }),
  update: (id: number, quantity: number) => api.patch(`/cart/${id}`, { quantity }),
  remove: (id: number) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart/clear'),
}
