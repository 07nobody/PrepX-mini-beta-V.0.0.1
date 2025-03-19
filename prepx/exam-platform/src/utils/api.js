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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token refresh logic here
      // For example, you can call an endpoint to refresh the token
      // and retry the original request
    }
    return Promise.reject(error);
  }
);

export default api;
