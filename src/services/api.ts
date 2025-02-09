import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signUp: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/sign-up', data),
  signIn: (data: { email: string; password: string }) =>
    api.post('/auth/sign-in', data),
  signOut: () => api.post('/auth/sign-out'),
};

// Subscription API
export const subscriptionAPI = {
  getAll: () => api.get('/subscriptions'),
  getById: (id: string) => api.get(`/subscriptions/${id}`),
  create: (data: {
    name: string;
    currency: string;
    price: number;
    frequency: string;
    category: string;
    paymentMethod: string;
    startDate: string;
  }) => api.post('/subscriptions', data),
  update: (id: string, data: any) => api.put(`/subscriptions/${id}`, data),
  delete: (id: string) => api.delete(`/subscriptions/${id}`),
  cancel: (id: string) => api.put(`/subscriptions/${id}/cancel`),
  getUserSubscriptions: () => api.get('/subscriptions/user'),
  getUpcomingRenewals: () => api.get('/subscriptions/upcoming-renewals'),
};