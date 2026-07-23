import { apiClient } from '../../../services/apiClient';
import { JobApplicationData } from '../../applications/services/applicationApi';

export interface AtsMetrics {
  [key: string]: number;
  total: number;
  SUBMITTED: number;
  UNDER_REVIEW: number;
  SHORTLISTED: number;
  INTERVIEW_SCHEDULED: number;
  INTERVIEW_COMPLETED: number;
  ASSESSMENT_PENDING: number;
  OFFER_EXTENDED: number;
  OFFER_ACCEPTED: number;
  OFFER_DECLINED: number;
  HIRED: number;
  REJECTED: number;
  WITHDRAWN: number;
}

export interface ApplicationNote {
  _id: string;
  application: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  content: string;
  isPinned: boolean;
  createdAt: string;
}

export const atsApi = {
  getMetrics: async (jobId?: string): Promise<AtsMetrics> => {
    const res = await apiClient.get<{ success: boolean; data: AtsMetrics }>('/employer/ats/metrics', { params: { jobId } });
    return res.data.data;
  },

  getApplications: async (params?: Record<string, unknown>): Promise<{ applications: JobApplicationData[]; total: number; page: number; pages: number }> => {
    const res = await apiClient.get<{ success: boolean; applications: JobApplicationData[]; total: number; page: number; pages: number }>('/employer/ats', { params });
    return res.data;
  },

  getApplicationById: async (id: string): Promise<JobApplicationData> => {
    const res = await apiClient.get<{ success: boolean; data: JobApplicationData }>(`/employer/ats/${id}`);
    return res.data.data;
  },

  updateStatus: async (id: string, status: string, reason?: string): Promise<JobApplicationData> => {
    const res = await apiClient.patch<{ success: boolean; data: JobApplicationData }>(`/employer/ats/${id}/status`, { status, reason });
    return res.data.data;
  },

  updateRating: async (id: string, rating: number): Promise<JobApplicationData> => {
    const res = await apiClient.patch<{ success: boolean; data: JobApplicationData }>(`/employer/ats/${id}/rating`, { rating });
    return res.data.data;
  },

  toggleFlag: async (id: string, flagged: boolean): Promise<JobApplicationData> => {
    const res = await apiClient.patch<{ success: boolean; data: JobApplicationData }>(`/employer/ats/${id}/flag`, { flagged });
    return res.data.data;
  },

  getNotes: async (id: string): Promise<ApplicationNote[]> => {
    const res = await apiClient.get<{ success: boolean; data: ApplicationNote[] }>(`/employer/ats/${id}/notes`);
    return res.data.data;
  },

  addNote: async (id: string, content: string, isPinned?: boolean): Promise<ApplicationNote> => {
    const res = await apiClient.post<{ success: boolean; data: ApplicationNote }>(`/employer/ats/${id}/notes`, { content, isPinned });
    return res.data.data;
  },

  deleteNote: async (id: string, noteId: string): Promise<void> => {
    await apiClient.delete(`/employer/ats/${id}/notes/${noteId}`);
  },

  bulkUpdate: async (applicationIds: string[], action: string, status?: string): Promise<{ updatedCount: number }> => {
    const res = await apiClient.post<{ success: boolean; data: { updatedCount: number } }>('/employer/ats/bulk-update', {
      applicationIds,
      action,
      status,
    });
    return res.data.data;
  },
};
