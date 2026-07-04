import { apiClient } from '../../../services/apiClient';
import { User } from '../../auth/types/auth.types';
import { JobData } from '../../jobs/services/jobApi';

export interface AdminStats {
  users: {
    candidates: number;
    employers: number;
    admins: number;
    total: number;
  };
  jobs: number;
  categories: number;
  savedBookmarks: number;
}

export interface AuditLogItem {
  _id: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export const adminApi = {
  async getStats(): Promise<AdminStats> {
    const res = await apiClient.get<{ success: boolean; data: AdminStats }>('/admin/stats');
    return res.data.data;
  },

  async getUsers(search?: string): Promise<User[]> {
    const res = await apiClient.get<{ success: boolean; data: User[] }>('/admin/users', {
      params: { search },
    });
    return res.data.data;
  },

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'): Promise<User> {
    const res = await apiClient.put<{ success: boolean; data: User }>(`/admin/users/${userId}/status`, { status });
    return res.data.data;
  },

  async updateUserRole(userId: string, role: 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER'): Promise<User> {
    const res = await apiClient.put<{ success: boolean; data: User }>(`/admin/users/${userId}/role`, { role });
    return res.data.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/admin/users/${userId}`);
  },

  async getJobs(): Promise<JobData[]> {
    const res = await apiClient.get<{ success: boolean; data: JobData[] }>('/admin/jobs');
    return res.data.data;
  },

  async deleteJob(jobId: string): Promise<void> {
    await apiClient.delete(`/admin/jobs/${jobId}`);
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    const res = await apiClient.get<{ success: boolean; data: AuditLogItem[] }>('/admin/audit-logs');
    return res.data.data;
  },
};
