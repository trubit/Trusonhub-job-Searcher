import { z } from 'zod';

export const makeDecisionSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  decision: z.enum(['APPROVED', 'REJECTED', 'HOLD', 'ESCALATED']),
  reason: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
});
