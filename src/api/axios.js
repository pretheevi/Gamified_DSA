import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://gamifieddsaserver-production.up.railway.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  console.log('Access token:', localStorage.getItem('access_token'));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;