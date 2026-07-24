import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offerApi } from '../services/offerApi';
import { CreateOfferPayload } from '../types/offer.types';

export function useMyOffers() {
  return useQuery({
    queryKey: ['my-offers'],
    queryFn: () => offerApi.getMyOffers(),
  });
}

export function useApplicationOffers(applicationId: string) {
  return useQuery({
    queryKey: ['application-offers', applicationId],
    queryFn: () => offerApi.getApplicationOffers(applicationId),
    enabled: !!applicationId,
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOfferPayload) => offerApi.createOffer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-offers'] });
    },
  });
}

export function useSendOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => offerApi.sendOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-offers'] });
    },
  });
}

export function useAcceptOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => offerApi.acceptOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-offers'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });
}

export function useDeclineOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => offerApi.declineOffer(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-offers'] });
    },
  });
}

export function useWithdrawOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => offerApi.withdrawOffer(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-offers'] });
    },
  });
}
