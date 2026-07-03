import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../../src/client/features/auth/store/useAuthStore';
import { User } from '../../../src/client/features/auth/types/auth.types';

describe('useAuthStore (Zustand)', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  const mockUser: User = {
    id: 'user-1',
    firstName: 'Alice',
    lastName: 'Smith',
    username: 'alicesmith',
    email: 'alice@example.com',
    role: 'JOB_SEEKER',
    status: 'ACTIVE',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  };

  it('starts with default unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('sets authentication state correctly', () => {
    useAuthStore.getState().setAuth(mockUser, 'mock-access-token');

    const state = useAuthStore.getState();
    expect(state.user?.email).toBe('alice@example.com');
    expect(state.accessToken).toBe('mock-access-token');
    expect(state.isAuthenticated).toBe(true);
    expect(state.isInitializing).toBe(false);
  });

  it('clears authentication state on logout', () => {
    useAuthStore.getState().setAuth(mockUser, 'mock-access-token');
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
