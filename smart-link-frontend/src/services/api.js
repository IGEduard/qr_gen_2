import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const linkAPI = {
  createLink: (data) => api.post('/api/links', data),
  createTextQR: (plainText) => api.post('/api/links/text', { plainText }),
  getAllLinks: () => api.get('/api/links'),
  getLink: (shortId) => api.get(`/api/links/data/${shortId}`),
};