import { UserRole, UserStatus } from '../../../database/models/User.js';

export interface UserResponseDto {
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
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
  expiresIn: string;
}

export interface SessionResponseDto {
  id: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastActivityAt: Date;
  isCurrent: boolean;
}
