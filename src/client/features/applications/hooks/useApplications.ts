import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi, CreateApplicationPayload } from '../services/applicationApi';

export function useMyApplications() {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: applicationApi.getMyApplications,
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationApi.getApplicationById(id),
    enabled: Boolean(id),
  });
}

export function useApplyJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApplicationPayload) => applicationApi.apply(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => applicationApi.withdraw(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });
}
