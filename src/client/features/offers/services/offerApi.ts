import { apiClient } from '../../../services/apiClient';
import { OfferData, CreateOfferPayload } from '../types/offer.types';

export const offerApi = {
  createOffer: async (payload: CreateOfferPayload): Promise<OfferData> => {
    const res = await apiClient.post<{ success: boolean; data: OfferData }>('/offers', payload);
    return res.data.data;
  },

  sendOffer: async (id: string): Promise<OfferData> => {
    const res = await apiClient.post<{ success: boolean; data: OfferData }>(`/offers/${id}/send`);
    return res.data.data;
  },

  acceptOffer: async (id: string): Promise<OfferData> => {
    const res = await apiClient.post<{ success: boolean; data: OfferData }>(`/offers/${id}/accept`);
    return res.data.data;
  },

  declineOffer: async (id: string, reason?: string): Promise<OfferData> => {
    const res = await apiClient.post<{ success: boolean; data: OfferData }>(`/offers/${id}/decline`, { reason });
    return res.data.data;
  },

  withdrawOffer: async (id: string, reason?: string): Promise<OfferData> => {
    const res = await apiClient.post<{ success: boolean; data: OfferData }>(`/offers/${id}/withdraw`, { reason });
    return res.data.data;
  },

  getMyOffers: async (): Promise<OfferData[]> => {
    const res = await apiClient.get<{ success: boolean; data: OfferData[] }>('/offers/my/all');
    return res.data.data;
  },

  getApplicationOffers: async (applicationId: string): Promise<OfferData[]> => {
    const res = await apiClient.get<{ success: boolean; data: OfferData[] }>(`/offers/application/${applicationId}`);
    return res.data.data;
  },
};
