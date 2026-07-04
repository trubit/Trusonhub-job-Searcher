import { apiClient } from '../../../services/apiClient';

export interface ResumeInfo {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
}

export interface JobApplicationData {
  _id: string;
  job: {
    _id: string;
    title: string;
    slug: string;
    company?: {
      name: string;
      logoUrl?: string;
      headquarters?: string;
    };
  };
  applicant: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  } | string;
  resume: ResumeInfo;
  coverLetter?: string;
  status: 'SUBMITTED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';
  createdAt: string;
}

export const applicationApi = {
  async applyToJob(jobId: string, resumeId: string, coverLetter?: string): Promise<JobApplicationData> {
    const res = await apiClient.post<{ success: boolean; data: JobApplicationData }>('/applications', {
      jobId,
      resumeId,
      coverLetter,
    });
    return res.data.data;
  },

  async getMyApplications(): Promise<JobApplicationData[]> {
    const res = await apiClient.get<{ success: boolean; data: JobApplicationData[] }>('/applications/my');
    return res.data.data;
  },

  async getJobApplications(jobId: string): Promise<JobApplicationData[]> {
    const res = await apiClient.get<{ success: boolean; data: JobApplicationData[] }>(`/applications/job/${jobId}`);
    return res.data.data;
  },

  async updateApplicationStatus(id: string, status: string): Promise<JobApplicationData> {
    const res = await apiClient.put<{ success: boolean; data: JobApplicationData }>(`/applications/${id}/status`, {
      status,
    });
    return res.data.data;
  },
};
