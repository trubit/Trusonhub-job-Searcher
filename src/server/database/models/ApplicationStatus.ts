import { Schema, model, Document, Model } from 'mongoose';

export type ApplicationStage =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'ASSESSMENT_PENDING'
  | 'OFFER_EXTENDED'
  | 'OFFER_ACCEPTED'
  | 'OFFER_DECLINED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface IApplicationStatus extends Document {
  code: ApplicationStage;
  label: string;
  description?: string;
  color: string;
  order: number;
  isActive: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const applicationStatusSchema = new Schema<IApplicationStatus>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSystem: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

applicationStatusSchema.index({ order: 1, isActive: 1 });

export const ApplicationStatus: Model<IApplicationStatus> = model<IApplicationStatus>(
  'ApplicationStatus',
  applicationStatusSchema
);
