import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/api/auth/reset-password/${token}`, data),
};

export const linkAPI = {
  createLink: (data) => api.post('/api/links', data),
  createTextQR: (plainText) => api.post('/api/links/text', { plainText }),
  getAllLinks: () => api.get('/api/links'),
  getLink: (shortId) => api.get(`/api/links/data/${shortId}`),
};