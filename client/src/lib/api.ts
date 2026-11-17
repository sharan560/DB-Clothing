import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('db_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
    // Guest session ID for cart
    const sessionId = getOrCreateSessionId();
    config.headers['x-session-id'] = sessionId;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('db_token');
      localStorage.removeItem('db_user');
      // Don't redirect here — let the component handle it
    }
    return Promise.reject(error.response?.data || { message: 'Network error. Please try again.' });
  }
);

function getOrCreateSessionId() {
  let id = sessionStorage.getItem('db_session_id');
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('db_session_id', id);
  }
  return id;
}

export default api;
