import { create } from 'zustand';
import { AuthState, User } from '../types/auth.types';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setAuth: (user: User, accessToken: string) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isInitializing: false,
    });
  },

  setAccessToken: (accessToken: string) => {
    set({ accessToken });
  },

  updateUser: (partialUser: Partial<User>) => {
    const current = get().user;
    if (current) {
      set({ user: { ...current, ...partialUser } });
    }
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
    });
  },

  setInitializing: (isInitializing: boolean) => {
    set({ isInitializing });
  },
}));
