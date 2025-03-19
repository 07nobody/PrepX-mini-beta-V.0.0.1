import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = window.Clerk?.session?.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
