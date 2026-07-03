import { apiClient } from '../../../services/apiClient';

export interface CompanyData {
  _id: string;
  owner: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverImageUrl?: string;
  website?: string;
  industry: string;
  companySize: string;
  foundedYear?: number;
  headquarters: string;
  description: string;
  mission?: string;
  vision?: string;
  culture?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
  };
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  gallery: Array<{ url: string; publicId: string; caption?: string; sortOrder: number }>;
  benefits: string[];
  isVerified: boolean;
  createdAt: string;
}

export const companyApi = {
  async getMyCompanies(): Promise<CompanyData[]> {
    const res = await apiClient.get<{ success: boolean; data: CompanyData[] }>('/company/my/all');
    return res.data.data;
  },

  async getCompany(idOrSlug: string): Promise<CompanyData> {
    const res = await apiClient.get<{ success: boolean; data: CompanyData }>(`/company/${idOrSlug}`);
    return res.data.data;
  },

  async createCompany(data: Partial<CompanyData>): Promise<CompanyData> {
    const res = await apiClient.post<{ success: boolean; data: CompanyData }>('/company', data);
    return res.data.data;
  },

  async updateCompany(id: string, data: Partial<CompanyData>): Promise<CompanyData> {
    const res = await apiClient.put<{ success: boolean; data: CompanyData }>(`/company/${id}`, data);
    return res.data.data;
  },

  async deleteCompany(id: string): Promise<void> {
    await apiClient.delete(`/company/${id}`);
  },
};
