import { apiClient } from '../../services/apiClient';

export interface PlatformStats {
  totalJobs: number;
  totalCompanies: number;
  totalCandidates: number;
  totalApplications: number;
}

export const statsApi = {
  async getPublicStats(): Promise<PlatformStats> {
    const res = await apiClient.get<{ success: boolean; data: PlatformStats }>('/stats/public');
    return res.data.data;
  },
};
