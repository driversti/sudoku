import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sudoku_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we had a token that's now invalid
      // If there's no token, 401 is expected (user not logged in)
      const token = localStorage.getItem('sudoku_token');
      if (token) {
        localStorage.removeItem('sudoku_token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
