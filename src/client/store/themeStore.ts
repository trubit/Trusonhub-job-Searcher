import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ThemeMode } from '../theme';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  getEffectiveMode: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      toggleTheme: () => {
        const currentEffective = get().getEffectiveMode();
        set({ mode: currentEffective === 'dark' ? 'light' : 'dark' });
      },
      setTheme: (mode) => set({ mode }),
      getEffectiveMode: () => {
        const { mode } = get();
        if (mode === 'system') {
          if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
          return 'dark';
        }
        return mode;
      },
    }),
    {
      name: 'trusonhub-theme',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
