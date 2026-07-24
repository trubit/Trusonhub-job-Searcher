export type OfferStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN' | 'EXPIRED';

export interface OfferData {
  _id: string;
  application: string;
  job: {
    _id: string;
    title: string;
    city?: string;
    country?: string;
    employmentType?: string;
  };
  candidate: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  employer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
  };
  positionTitle: string;
  salary: number;
  currency: string;
  benefits: string[];
  startDate: string;
  expirationDate: string;
  terms?: string;
  status: OfferStatus;
  version: number;
  declineReason?: string;
  withdrawalReason?: string;
  acceptedAt?: string;
  createdAt: string;
}

export interface CreateOfferPayload {
  applicationId: string;
  positionTitle: string;
  salary: number;
  currency?: string;
  benefits?: string[];
  startDate: string;
  expirationDate: string;
  terms?: string;
}
