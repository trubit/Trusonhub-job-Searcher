import { z } from 'zod';

export const createOfferSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  positionTitle: z.string().min(2, 'Position title is required').max(150),
  salary: z.number().min(0, 'Salary must be positive'),
  currency: z.string().default('USD'),
  benefits: z.array(z.string()).optional(),
  startDate: z.string().datetime({ message: 'Start date must be a valid ISO date string' }),
  expirationDate: z.string().datetime({ message: 'Expiration date must be a valid ISO date string' }),
  terms: z.string().max(5000).optional(),
});

export const updateOfferSchema = z.object({
  positionTitle: z.string().min(2).max(150).optional(),
  salary: z.number().min(0).optional(),
  currency: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  expirationDate: z.string().datetime().optional(),
  terms: z.string().max(5000).optional(),
});

export const respondOfferSchema = z.object({
  reason: z.string().max(1000).optional(),
});
