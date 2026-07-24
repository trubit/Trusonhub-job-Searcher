import { z } from 'zod';

export const scheduleInterviewSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  type: z.enum(['PHONE', 'VIDEO', 'ONSITE', 'TECHNICAL', 'HR', 'PANEL', 'FINAL']).default('VIDEO'),
  scheduledAt: z.string().datetime({ message: 'Must be a valid ISO date-time string' }),
  durationMinutes: z.number().min(15).max(480).optional().default(45),
  timeZone: z.string().optional().default('UTC'),
  locationOrLink: z.string().optional(),
  platform: z.string().optional().default('Google Meet'),
  notes: z.string().max(2000).optional(),
  interviewerIds: z.array(z.string()).optional(),
});

export const updateInterviewSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  durationMinutes: z.number().min(15).max(480).optional(),
  locationOrLink: z.string().optional(),
  platform: z.string().optional(),
  notes: z.string().max(2000).optional(),
  type: z.enum(['PHONE', 'VIDEO', 'ONSITE', 'TECHNICAL', 'HR', 'PANEL', 'FINAL']).optional(),
});

export const cancelInterviewSchema = z.object({
  reason: z.string().max(1000).optional(),
});

export const submitFeedbackSchema = z.object({
  overallRating: z.number().min(1).max(5),
  recommendation: z.enum(['STRONG_HIRE', 'RECOMMEND_HIRE', 'NEUTRAL', 'REJECT', 'ANOTHER_INTERVIEW']),
  skillScores: z.array(z.object({ skill: z.string(), rating: z.number().min(1).max(5) })).optional(),
  strengths: z.string().max(2000).optional(),
  weaknesses: z.string().max(2000).optional(),
  comments: z.string().max(3000).optional(),
});
