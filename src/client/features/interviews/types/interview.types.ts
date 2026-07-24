export type InterviewType = 'PHONE' | 'VIDEO' | 'ONSITE' | 'TECHNICAL' | 'HR' | 'PANEL' | 'FINAL';
export type InterviewStatus = 'SCHEDULED' | 'RESCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Interviewer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export interface InterviewData {
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
  interviewers: Interviewer[];
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  durationMinutes: number;
  timeZone: string;
  locationOrLink?: string;
  platform?: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface ScheduleInterviewPayload {
  applicationId: string;
  type: InterviewType;
  scheduledAt: string;
  durationMinutes?: number;
  timeZone?: string;
  locationOrLink?: string;
  platform?: string;
  notes?: string;
}

export interface SubmitFeedbackPayload {
  overallRating: number;
  recommendation: 'STRONG_HIRE' | 'RECOMMEND_HIRE' | 'NEUTRAL' | 'REJECT' | 'ANOTHER_INTERVIEW';
  strengths?: string;
  weaknesses?: string;
  comments?: string;
}
