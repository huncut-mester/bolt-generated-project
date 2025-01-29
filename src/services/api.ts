import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuthStore();
    
    if (error.response?.status === 401) {
      auth.logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  updatePassword: (data: any) => api.put('/users/password', data),
  updateMfa: (data: any) => api.put('/users/mfa', data),
  getActivityLog: (params: any) => api.get('/users/activity', { params })
};

export const settingsApi = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data: any) => api.put('/settings', data),
  getNotificationPreferences: () => api.get('/settings/notifications'),
  updateNotificationPreferences: (data: any) => api.put('/settings/notifications', data)
};

export default api;
