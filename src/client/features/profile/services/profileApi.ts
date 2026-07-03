import { apiClient } from '../../../services/apiClient';
import { JobSeekerProfileData } from '../types/profile.types';

export const profileApi = {
  async getMyProfile(): Promise<JobSeekerProfileData> {
    const res = await apiClient.get<{ success: boolean; data: JobSeekerProfileData }>('/profile');
    return res.data.data;
  },

  async updateProfile(data: Partial<JobSeekerProfileData['profile']>): Promise<JobSeekerProfileData> {
    const res = await apiClient.put<{ success: boolean; data: JobSeekerProfileData }>('/profile', data);
    return res.data.data;
  },

  async deletePhoto(): Promise<JobSeekerProfileData> {
    const res = await apiClient.delete<{ success: boolean; data: JobSeekerProfileData }>('/profile/photo');
    return res.data.data;
  },

  async getPublicProfile(username: string): Promise<JobSeekerProfileData> {
    const res = await apiClient.get<{ success: boolean; data: JobSeekerProfileData }>(`/profile/public/${username}`);
    return res.data.data;
  },

  // Education
  async addEducation(data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.post<{ success: boolean; data: JobSeekerProfileData }>('/profile/education', data);
    return res.data.data;
  },
  async updateEducation(id: string, data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.put<{ success: boolean; data: JobSeekerProfileData }>(`/profile/education/${id}`, data);
    return res.data.data;
  },
  async deleteEducation(id: string): Promise<JobSeekerProfileData> {
    const res = await apiClient.delete<{ success: boolean; data: JobSeekerProfileData }>(`/profile/education/${id}`);
    return res.data.data;
  },

  // Experience
  async addExperience(data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.post<{ success: boolean; data: JobSeekerProfileData }>('/profile/experience', data);
    return res.data.data;
  },
  async updateExperience(id: string, data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.put<{ success: boolean; data: JobSeekerProfileData }>(`/profile/experience/${id}`, data);
    return res.data.data;
  },
  async deleteExperience(id: string): Promise<JobSeekerProfileData> {
    const res = await apiClient.delete<{ success: boolean; data: JobSeekerProfileData }>(`/profile/experience/${id}`);
    return res.data.data;
  },

  // Skills
  async addSkill(data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.post<{ success: boolean; data: JobSeekerProfileData }>('/profile/skills', data);
    return res.data.data;
  },
  async updateSkill(id: string, data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.put<{ success: boolean; data: JobSeekerProfileData }>(`/profile/skills/${id}`, data);
    return res.data.data;
  },
  async deleteSkill(id: string): Promise<JobSeekerProfileData> {
    const res = await apiClient.delete<{ success: boolean; data: JobSeekerProfileData }>(`/profile/skills/${id}`);
    return res.data.data;
  },

  // Certifications
  async addCertification(data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.post<{ success: boolean; data: JobSeekerProfileData }>('/profile/certifications', data);
    return res.data.data;
  },
  async updateCertification(id: string, data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.put<{ success: boolean; data: JobSeekerProfileData }>(`/profile/certifications/${id}`, data);
    return res.data.data;
  },
  async deleteCertification(id: string): Promise<JobSeekerProfileData> {
    const res = await apiClient.delete<{ success: boolean; data: JobSeekerProfileData }>(`/profile/certifications/${id}`);
    return res.data.data;
  },

  // Languages
  async addLanguage(data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.post<{ success: boolean; data: JobSeekerProfileData }>('/profile/languages', data);
    return res.data.data;
  },
  async updateLanguage(id: string, data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.put<{ success: boolean; data: JobSeekerProfileData }>(`/profile/languages/${id}`, data);
    return res.data.data;
  },
  async deleteLanguage(id: string): Promise<JobSeekerProfileData> {
    const res = await apiClient.delete<{ success: boolean; data: JobSeekerProfileData }>(`/profile/languages/${id}`);
    return res.data.data;
  },

  // Portfolio
  async addPortfolio(data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.post<{ success: boolean; data: JobSeekerProfileData }>('/profile/portfolio', data);
    return res.data.data;
  },
  async updatePortfolio(id: string, data: Record<string, unknown>): Promise<JobSeekerProfileData> {
    const res = await apiClient.put<{ success: boolean; data: JobSeekerProfileData }>(`/profile/portfolio/${id}`, data);
    return res.data.data;
  },
  async deletePortfolio(id: string): Promise<JobSeekerProfileData> {
    const res = await apiClient.delete<{ success: boolean; data: JobSeekerProfileData }>(`/profile/portfolio/${id}`);
    return res.data.data;
  },
};
