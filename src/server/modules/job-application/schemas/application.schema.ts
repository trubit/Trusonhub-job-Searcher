import { z } from 'zod';

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  resumeId: z.string().optional(),
  resumeUrl: z.string().url('Invalid resume URL').optional(),
  coverLetter: z.string().max(5000, 'Cover letter cannot exceed 5000 characters').optional(),
  isDraft: z.boolean().optional().default(false),
});

export const withdrawApplicationSchema = z.object({
  reason: z.string().max(500, 'Reason cannot exceed 500 characters').optional(),
});

export type CreateApplicationDTO = z.input<typeof createApplicationSchema>;
export type WithdrawApplicationDTO = z.input<typeof withdrawApplicationSchema>;
