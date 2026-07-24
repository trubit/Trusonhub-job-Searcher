import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewApi } from '../services/interviewApi';
import { ScheduleInterviewPayload, SubmitFeedbackPayload } from '../types/interview.types';

export function useMyInterviews() {
  return useQuery({
    queryKey: ['my-interviews'],
    queryFn: () => interviewApi.getMyInterviews(),
  });
}

export function useApplicationInterviews(applicationId: string) {
  return useQuery({
    queryKey: ['application-interviews', applicationId],
    queryFn: () => interviewApi.getApplicationInterviews(applicationId),
    enabled: !!applicationId,
  });
}

export function useScheduleInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ScheduleInterviewPayload) => interviewApi.scheduleInterview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['ats-candidates'] });
    },
  });
}

export function useUpdateInterviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      interviewApi.updateStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-interviews'] });
    },
  });
}

export function useSubmitInterviewFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SubmitFeedbackPayload }) =>
      interviewApi.submitFeedback(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-interviews'] });
    },
  });
}
