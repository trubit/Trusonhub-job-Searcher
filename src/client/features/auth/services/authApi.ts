import { apiClient } from '../../../services/apiClient';
import { User, SessionInfo } from '../types/auth.types';
import {
  LoginFormData,
  RegisterJobSeekerFormData,
  RegisterEmployerFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from '../validation/auth.validation';

export interface AuthApiResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    accessToken: string;
    expiresIn: string;
  };
}

export const authApi = {
  async registerJobSeeker(data: RegisterJobSeekerFormData): Promise<AuthApiResponse> {
    const res = await apiClient.post<AuthApiResponse>('/auth/register/job-seeker', data);
    return res.data;
  },

  async registerEmployer(data: RegisterEmployerFormData): Promise<AuthApiResponse> {
    const res = await apiClient.post<AuthApiResponse>('/auth/register/employer', data);
    return res.data;
  },

  async login(data: LoginFormData): Promise<AuthApiResponse> {
    const res = await apiClient.post<AuthApiResponse>('/auth/login', data);
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
    return res.data.data;
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  },

  async resendVerification(email: string): Promise<void> {
    await apiClient.post('/auth/resend-verification', { email });
  },

  async forgotPassword(data: ForgotPasswordFormData): Promise<void> {
    await apiClient.post('/auth/forgot-password', data);
  },

  async resetPassword(token: string, data: ResetPasswordFormData): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, newPassword: data.newPassword });
  },

  async getActiveSessions(): Promise<SessionInfo[]> {
    const res = await apiClient.get<{ success: boolean; data: SessionInfo[] }>('/auth/sessions');
    return res.data.data;
  },

  async revokeSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
  },

  async logoutAll(): Promise<void> {
    await apiClient.delete('/auth/logout-all');
  },
};
