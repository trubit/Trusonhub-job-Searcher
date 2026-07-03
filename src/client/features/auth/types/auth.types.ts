export type UserRole = 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  companyName?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastActivityAt: string;
  isCurrent: boolean;
}
