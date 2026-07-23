import { z } from 'zod';

export const updateStatusSchema = z.object({
  status: z.enum([
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'INTERVIEW_COMPLETED',
    'ASSESSMENT_PENDING',
    'OFFER_EXTENDED',
    'OFFER_ACCEPTED',
    'OFFER_DECLINED',
    'HIRED',
    'REJECTED',
    'WITHDRAWN',
  ]),
  reason: z.string().optional(),
});

export const updateRatingSchema = z.object({
  rating: z.number().min(0).max(5),
});

export const toggleFlagSchema = z.object({
  flagged: z.boolean(),
});

export const createNoteSchema = z.object({
  content: z.string().min(1, 'Note content cannot be empty').max(2000),
  isPinned: z.boolean().optional().default(false),
});

export const bulkUpdateSchema = z.object({
  applicationIds: z.array(z.string().min(1)).min(1, 'At least one application ID must be provided'),
  action: z.enum(['SHORTLIST', 'REJECT', 'ARCHIVE', 'CHANGE_STATUS']),
  status: z.enum([
    'UNDER_REVIEW',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'INTERVIEW_COMPLETED',
    'OFFER_EXTENDED',
    'HIRED',
    'REJECTED',
    'WITHDRAWN',
  ]).optional(),
});

export type UpdateStatusDTO = z.infer<typeof updateStatusSchema>;
export type UpdateRatingDTO = z.infer<typeof updateRatingSchema>;
export type ToggleFlagDTO = z.infer<typeof toggleFlagSchema>;
export type CreateNoteDTO = z.infer<typeof createNoteSchema>;
export type BulkUpdateDTO = z.infer<typeof bulkUpdateSchema>;
