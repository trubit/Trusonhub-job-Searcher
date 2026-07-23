import { apiClient } from '../../../services/apiClient';

export interface JobApplicationData {
  _id: string;
  job: {
    _id: string;
    title: string;
    slug?: string;
    city: string;
    country: string;
    employmentType: string;
    company?: {
      name: string;
      logoUrl?: string;
    };
  };
  applicant?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    phone?: string;
    phoneNumber?: string;
    location?: string;
    headline?: string;
  };
  company?: {
    _id: string;
    name: string;
    logoUrl?: string;
  };
  resume?: {
    _id: string;
    fileUrl?: string;
    fileName?: string;
    title?: string;
  };
  status: string;
  coverLetter?: string;
  resumeUrl?: string;
  rating?: number;
  flagged?: boolean;
  notesCount?: number;
  submittedAt?: string;
  createdAt: string;
}

export interface CreateApplicationPayload {
  jobId: string;
  resumeId?: string;
  resumeUrl?: string;
  coverLetter?: string;
  isDraft?: boolean;
}

export const applicationApi = {
  apply: async (payload: CreateApplicationPayload): Promise<JobApplicationData> => {
    const res = await apiClient.post<{ success: boolean; data: JobApplicationData }>('/applications', payload);
    return res.data.data;
  },

  applyToJob: async (jobId: string, resumeId?: string, coverLetter?: string): Promise<JobApplicationData> => {
    return applicationApi.apply({ jobId, resumeId, coverLetter });
  },

  getMyApplications: async (): Promise<JobApplicationData[]> => {
    const res = await apiClient.get<{ success: boolean; data: JobApplicationData[] }>('/applications/me');
    return res.data.data;
  },

  getJobApplications: async (_jobId?: string): Promise<JobApplicationData[]> => {
    const res = await apiClient.get<{ success: boolean; applications: JobApplicationData[] }>('/employer/ats');
    return res.data.applications || [];
  },

  getApplicationById: async (id: string): Promise<JobApplicationData> => {
    const res = await apiClient.get<{ success: boolean; data: JobApplicationData }>(`/applications/${id}`);
    return res.data.data;
  },

  updateApplicationStatus: async (id: string, status: string): Promise<JobApplicationData> => {
    const res = await apiClient.patch<{ success: boolean; data: JobApplicationData }>(`/employer/ats/${id}/status`, { status });
    return res.data.data;
  },

  withdraw: async (id: string, reason?: string): Promise<JobApplicationData> => {
    const res = await apiClient.post<{ success: boolean; data: JobApplicationData }>(`/applications/${id}/withdraw`, { reason });
    return res.data.data;
  },
};
