import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '../../../../src/client/store/themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: 'light' });
  });

  it('toggles mode between light and dark', () => {
    expect(useThemeStore.getState().mode).toBe('light');
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().mode).toBe('dark');
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().mode).toBe('light');
  });

  it('sets explicit theme mode', () => {
    useThemeStore.getState().setTheme('dark');
    expect(useThemeStore.getState().mode).toBe('dark');
  });
});
