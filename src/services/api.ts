import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies support
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // General error handling
    if (error.response) {
      // Error from server
      return Promise.reject(error);
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('No connection to server'));
    } else {
      // Error setting up the request
      return Promise.reject(error);
    }
  }
);

export default api;

