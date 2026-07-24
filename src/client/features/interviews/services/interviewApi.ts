import { apiClient } from '../../../services/apiClient';
import { InterviewData, ScheduleInterviewPayload, SubmitFeedbackPayload } from '../types/interview.types';

export const interviewApi = {
  scheduleInterview: async (payload: ScheduleInterviewPayload): Promise<InterviewData> => {
    const res = await apiClient.post<{ success: boolean; data: InterviewData }>('/interviews', payload);
    return res.data.data;
  },

  getMyInterviews: async (): Promise<InterviewData[]> => {
    const res = await apiClient.get<{ success: boolean; data: InterviewData[] }>('/interviews/my/all');
    return res.data.data;
  },

  getApplicationInterviews: async (applicationId: string): Promise<InterviewData[]> => {
    const res = await apiClient.get<{ success: boolean; data: InterviewData[] }>(
      `/interviews/application/${applicationId}`
    );
    return res.data.data;
  },

  updateStatus: async (id: string, status: string, reason?: string): Promise<InterviewData> => {
    const res = await apiClient.patch<{ success: boolean; data: InterviewData }>(`/interviews/${id}/status`, {
      status,
      reason,
    });
    return res.data.data;
  },

  submitFeedback: async (id: string, payload: SubmitFeedbackPayload): Promise<void> => {
    await apiClient.post(`/interviews/${id}/feedback`, payload);
  },
};
