import { apiClient } from '../../../services/apiClient';

export interface ResumeItem {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  mimeType: string;
  isPrimary: boolean;
  createdAt: string;
}

export const resumeApi = {
  async getResumes(): Promise<ResumeItem[]> {
    const res = await apiClient.get<{ success: boolean; data: ResumeItem[] }>('/resume');
    return res.data.data;
  },

  async uploadResume(file: File): Promise<ResumeItem> {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await apiClient.post<{ success: boolean; data: ResumeItem }>('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async deleteResume(id: string): Promise<void> {
    await apiClient.delete(`/resume/${id}`);
  },

  async setPrimary(id: string): Promise<ResumeItem> {
    const res = await apiClient.put<{ success: boolean; data: ResumeItem }>(`/resume/${id}/primary`);
    return res.data.data;
  },
};
