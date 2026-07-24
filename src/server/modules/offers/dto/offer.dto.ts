import { OfferStatus } from '../../../database/models/JobOffer.js';

export interface CreateOfferDto {
  applicationId: string;
  positionTitle: string;
  salary: number;
  currency?: string;
  benefits?: string[];
  startDate: string;
  expirationDate: string;
  terms?: string;
}

export interface UpdateOfferDto {
  positionTitle?: string;
  salary?: number;
  currency?: string;
  benefits?: string[];
  startDate?: string;
  expirationDate?: string;
  terms?: string;
}

export interface RespondOfferDto {
  reason?: string;
}

export interface OfferResponseDto {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  positionTitle: string;
  salary: number;
  currency: string;
  benefits: string[];
  startDate: Date;
  expirationDate: Date;
  terms?: string;
  status: OfferStatus;
  version: number;
  createdAt: Date;
}
