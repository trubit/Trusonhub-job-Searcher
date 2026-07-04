import { apiClient } from '../../../services/apiClient';
import { CompanyData } from '../../company/services/companyApi';

export interface JobData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  qualifications?: string;
  employmentType: string;
  category: string;
  experienceLevel: 'ENTRY_LEVEL' | 'JUNIOR' | 'MID_LEVEL' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
  careerLevel?: string;
  industry?: string;
  department?: string;
  salaryType: 'HOURLY' | 'MONTHLY' | 'YEARLY' | 'COMMISSION' | 'NEGOTIABLE';
  minimumSalary?: number;
  maximumSalary?: number;
  currency: string;
  salaryVisibility: 'PUBLIC' | 'PRIVATE';
  country: string;
  state?: string;
  city: string;
  remoteOption: 'REMOTE' | 'HYBRID' | 'ON_SITE';
  workplaceType?: string;
  vacancies?: number;
  applicationDeadline?: string;
  benefits?: string[];
  requiredSkills?: string[];
  languages?: string[];
  tags?: string[];
  employer: string | { _id: string; firstName: string; lastName: string; email: string; avatarUrl?: string };
  company: CompanyData;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'PRIVATE';
  totalViews: number;
  uniqueViews: number;
  totalSaves: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobSearchParams {
  keyword?: string;
  location?: string;
  category?: string;
  employmentType?: string;
  experienceLevel?: string;
  remoteOption?: string;
  minSalary?: number;
  maxSalary?: number;
  companyId?: string;
  datePosted?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface JobCategoryData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface JobTypeData {
  _id: string;
  name: string;
  slug: string;
}

export interface JobLocationData {
  _id: string;
  name: string;
  slug: string;
}

export const jobApi = {
  async searchJobs(params: JobSearchParams): Promise<{ jobs: JobData[]; total: number; page: number; pages: number }> {
    const res = await apiClient.get<{ success: boolean; jobs: JobData[]; total: number; page: number; pages: number }>('/jobs/search', { params });
    return res.data;
  },

  async getJobDetails(slug: string): Promise<JobData> {
    const res = await apiClient.get<{ success: boolean; data: JobData }>(`/jobs/${slug}`);
    return res.data.data;
  },

  async createJob(data: Partial<JobData>): Promise<JobData> {
    const res = await apiClient.post<{ success: boolean; data: JobData }>('/jobs', data);
    return res.data.data;
  },

  async updateJob(id: string, data: Partial<JobData>): Promise<JobData> {
    const res = await apiClient.put<{ success: boolean; data: JobData }>(`/jobs/${id}`, data);
    return res.data.data;
  },

  async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },

  async duplicateJob(id: string): Promise<JobData> {
    const res = await apiClient.post<{ success: boolean; data: JobData }>(`/jobs/${id}/duplicate`);
    return res.data.data;
  },

  async getEmployerJobs(): Promise<JobData[]> {
    const res = await apiClient.get<{ success: boolean; data: JobData[] }>('/employer/jobs');
    return res.data.data;
  },

  async getCompanyJobs(companyId: string): Promise<JobData[]> {
    const res = await apiClient.get<{ success: boolean; data: JobData[] }>(`/jobs/company/${companyId}`);
    return res.data.data;
  },

  // Bookmarks
  async bookmarkJob(id: string): Promise<void> {
    await apiClient.post(`/jobs/${id}/bookmark`);
  },

  async unbookmarkJob(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}/bookmark`);
  },

  async getBookmarks(): Promise<Array<{ _id: string; job: JobData; createdAt: string }>> {
    const res = await apiClient.get<{ success: boolean; data: Array<{ _id: string; job: JobData; createdAt: string }> }>('/bookmarks');
    return res.data.data;
  },

  // Configuration
  async getCategories(): Promise<JobCategoryData[]> {
    const res = await apiClient.get<{ success: boolean; data: JobCategoryData[] }>('/job-categories');
    return res.data.data;
  },

  async getJobTypes(): Promise<JobTypeData[]> {
    const res = await apiClient.get<{ success: boolean; data: JobTypeData[] }>('/job-types');
    return res.data.data;
  },

  async getJobLocations(): Promise<JobLocationData[]> {
    const res = await apiClient.get<{ success: boolean; data: JobLocationData[] }>('/job-locations');
    return res.data.data;
  },
};
