import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const linkAPI = {
  createLink: (data) => api.post('/api/links', data),
  getAllLinks: () => api.get('/api/links'),
  getLink: (shortId) => api.get(`/api/links/data/${shortId}`),
};