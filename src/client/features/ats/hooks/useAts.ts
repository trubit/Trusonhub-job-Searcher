import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { atsApi } from '../services/atsApi';

export function useAtsMetrics(jobId?: string) {
  return useQuery({
    queryKey: ['ats-metrics', jobId],
    queryFn: () => atsApi.getMetrics(jobId),
  });
}

export function useAtsApplications(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['ats-applications', params],
    queryFn: () => atsApi.getApplications(params),
  });
}

export function useAtsApplication(id: string) {
  return useQuery({
    queryKey: ['ats-application', id],
    queryFn: () => atsApi.getApplicationById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateAtsStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      atsApi.updateStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ats-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['ats-applications'] });
      queryClient.invalidateQueries({ queryKey: ['ats-application'] });
    },
  });
}

export function useUpdateAtsRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) => atsApi.updateRating(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ats-applications'] });
      queryClient.invalidateQueries({ queryKey: ['ats-application'] });
    },
  });
}

export function useToggleAtsFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, flagged }: { id: string; flagged: boolean }) => atsApi.toggleFlag(id, flagged),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ats-applications'] });
      queryClient.invalidateQueries({ queryKey: ['ats-application'] });
    },
  });
}

export function useAtsNotes(id: string) {
  return useQuery({
    queryKey: ['ats-notes', id],
    queryFn: () => atsApi.getNotes(id),
    enabled: Boolean(id),
  });
}

export function useAddAtsNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content, isPinned }: { id: string; content: string; isPinned?: boolean }) =>
      atsApi.addNote(id, content, isPinned),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ats-notes', variables.id] });
    },
  });
}

export function useDeleteAtsNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, noteId }: { id: string; noteId: string }) => atsApi.deleteNote(id, noteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ats-notes', variables.id] });
    },
  });
}

export function useBulkUpdateAts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationIds, action, status }: { applicationIds: string[]; action: string; status?: string }) =>
      atsApi.bulkUpdate(applicationIds, action, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ats-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['ats-applications'] });
    },
  });
}
