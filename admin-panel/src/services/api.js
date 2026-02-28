import axios from 'axios';

const API_BASE_URL = 'https://bank-fraud-detection-vjvm.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAuthApi = {
  login: (formData) => {
    const params = new URLSearchParams();
    params.append('username', formData.email);
    params.append('password', formData.password);
    return api.post('/auth/admin/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
};

export const adminDataApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getTransactions: () => api.get('/admin/transactions'),
  getFraudLogs: () => api.get('/admin/fraud-logs'),
  unholdUser: (userId) => api.post(`/admin/unhold/${userId}`),
  blockUser: (userId) => api.post(`/admin/block/${userId}`),
  unblockUser: (userId) => api.post(`/admin/unblock/${userId}`),
};

export default api;
