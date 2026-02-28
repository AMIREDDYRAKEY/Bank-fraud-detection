import axios from 'axios';

const API_BASE_URL = 'https://bank-fraud-detection-p1by.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getMe: () => api.get('/user/me'),
};

export const bankApi = {
  sendMoney: (data) => api.post('/transaction/send', data),
  getHistory: () => api.get('/transactions/history'),
};

export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  getFraudLogs: () => api.get('/admin/fraud-logs'),
  unholdUser: (userId) => api.post(`/admin/unhold/${userId}`),
};

export default api;
