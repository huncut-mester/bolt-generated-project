import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const mfaRequired = ref(false);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => 
    user.value?.role === 'super_admin' || user.value?.role === 'admin'
  );

  async function login(credentials: { email: string; password: string }) {
    try {
      loading.value = true;
      const response = await axios.post('/api/auth/login', credentials);
      
      if (response.data.mfaRequired) {
        mfaRequired.value = true;
        return { mfaRequired: true };
      }

      setAuthData(response.data);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function verifyMfa(code: string) {
    try {
      loading.value = true;
      const response = await axios.post('/api/auth/verify-mfa', { code });
      setAuthData(response.data);
      mfaRequired.value = false;
      return { success: true };
    } catch (error) {
      console.error('MFA verification failed:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function setAuthData(data: { user: User; token: string }) {
    user.value = data.user;
    token.value = data.token;
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  return {
    user,
    token,
    mfaRequired,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    verifyMfa,
    logout
  };
});
