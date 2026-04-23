import axios from 'axios';
import { STORAGE_KEYS } from '../constants';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    if (error.response?.status === 403) {
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
