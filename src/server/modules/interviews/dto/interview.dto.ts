import { InterviewType } from '../../../database/models/Interview.js';

export interface ScheduleInterviewDto {
  applicationId: string;
  type: InterviewType;
  scheduledAt: string;
  durationMinutes?: number;
  timeZone?: string;
  locationOrLink?: string;
  platform?: string;
  notes?: string;
  interviewerIds?: string[];
}

export interface UpdateInterviewDto {
  scheduledAt?: string;
  durationMinutes?: number;
  locationOrLink?: string;
  platform?: string;
  notes?: string;
  type?: InterviewType;
}

export interface CancelInterviewDto {
  reason?: string;
}

export interface SubmitFeedbackDto {
  overallRating: number;
  recommendation: 'STRONG_HIRE' | 'RECOMMEND_HIRE' | 'NEUTRAL' | 'REJECT' | 'ANOTHER_INTERVIEW';
  skillScores?: Array<{ skill: string; rating: number }>;
  strengths?: string;
  weaknesses?: string;
  comments?: string;
}
