import { Schema, model, Document, Model, Types } from 'mongoose';
import { ApplicationStage } from './ApplicationStatus.js';

export interface IJobApplication extends Document {
  job: Types.ObjectId;
  applicant: Types.ObjectId;
  employer: Types.ObjectId;
  company: Types.ObjectId;
  resume?: Types.ObjectId;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStage;
  source: string;
  rating: number; // 0 to 5 stars
  flagged: boolean;
  notesCount: number;
  isDraft: boolean;
  submittedAt?: Date;
  withdrawnAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    resume: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
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
      ],
      default: 'SUBMITTED',
      index: true,
    },
    source: {
      type: String,
      default: 'Talentra Platform',
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    notesCount: {
      type: Number,
      default: 0,
    },
    isDraft: {
      type: Boolean,
      default: false,
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    withdrawnAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// High-speed compound indexes for duplicate checking, candidate listing, and employer ATS queries
jobApplicationSchema.index({ job: 1, applicant: 1, isDeleted: 1 }, { unique: true });
jobApplicationSchema.index({ employer: 1, status: 1, isDeleted: 1 });
jobApplicationSchema.index({ company: 1, status: 1, isDeleted: 1 });
jobApplicationSchema.index({ applicant: 1, isDeleted: 1, createdAt: -1 });

export const JobApplication: Model<IJobApplication> = model<IJobApplication>('JobApplication', jobApplicationSchema);
export default JobApplication;
