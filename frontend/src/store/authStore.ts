import { create } from 'zustand';
import { User, UserPreference } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreference>) => Promise<void>;
  testAIKey: (provider: string, model: string, apiKey?: string, customBaseUrl?: string) => Promise<any>;
  clearError: () => void;
}

const formatErrorMessage = (err: any): string => {
  if (!err.response) {
    return 'Cannot connect to Compass Backend. Please verify Python FastAPI server is running on http://localhost:8000.';
  }
  const detail = err.response.data?.detail;
  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail)) {
    return detail.map((e: any) => e.msg || e.detail || JSON.stringify(e)).join(', ');
  }
  if (detail && typeof detail === 'object') {
    return detail.msg || JSON.stringify(detail);
  }
  return 'Authentication request failed. Please check your inputs.';
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('compass_access_token'),
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password
      });
      const { access_token, refresh_token, user } = response.data;
      localStorage.setItem('compass_access_token', access_token);
      localStorage.setItem('compass_refresh_token', refresh_token);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: any) {
      set({
        error: formatErrorMessage(err),
        isLoading: false,
      });
    }
  },

  register: async (email, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', {
        email: email.trim(),
        password,
        full_name: fullName.trim(),
      });
      const { access_token, refresh_token, user } = response.data;
      localStorage.setItem('compass_access_token', access_token);
      localStorage.setItem('compass_refresh_token', refresh_token);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: any) {
      set({
        error: formatErrorMessage(err),
        isLoading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem('compass_access_token');
    localStorage.removeItem('compass_refresh_token');
    set({ user: null, isAuthenticated: false });
  },

  fetchCurrentUser: async () => {
    const token = localStorage.getItem('compass_access_token');
    if (!token) return;
    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (err) {
      localStorage.removeItem('compass_access_token');
      localStorage.removeItem('compass_refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updatePreferences: async (prefs) => {
    try {
      const res = await api.put('/auth/preferences', prefs);
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              preferences: res.data,
            }
          : null,
      }));
    } catch (err) {
      console.error('Failed to update preferences:', err);
    }
  },

  testAIKey: async (provider, model, apiKey, customBaseUrl) => {
    const res = await api.post('/auth/test-ai-key', {
      provider,
      model,
      api_key: apiKey,
      custom_base_url: customBaseUrl,
    });
    return res.data;
  },
}));
