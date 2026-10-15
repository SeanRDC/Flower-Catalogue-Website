import axios from 'axios';

// Set VITE_API_URL in client/.env to point at a different backend
// (e.g. http://localhost:5000 when running the server locally).
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://flower-catalogue-website.onrender.com').replace(/\/$/, '');

export const TOKEN_KEY = 'peony_token';
export const USER_KEY = 'peony_user';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Lets the auth context react when the server rejects an expired token.
let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth/');
    if (error.response?.status === 401 && !isAuthRoute && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);
