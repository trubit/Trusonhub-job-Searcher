import { Schema, model, Document, Model, Types } from 'mongoose';

export type InterviewType = 'PHONE' | 'VIDEO' | 'ONSITE' | 'TECHNICAL' | 'HR' | 'PANEL' | 'FINAL';
export type InterviewStatus = 'SCHEDULED' | 'RESCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface IInterview extends Document {
  _id: Types.ObjectId;
  application: Types.ObjectId;
  job: Types.ObjectId;
  candidate: Types.ObjectId;
  employer: Types.ObjectId;
  interviewers: Types.ObjectId[];
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: Date;
  durationMinutes: number;
  timeZone: string;
  locationOrLink?: string;
  platform?: string;
  notes?: string;
  cancellationReason?: string;
  rescheduledFrom?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    candidate: {
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
    interviewers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    type: {
      type: String,
      enum: ['PHONE', 'VIDEO', 'ONSITE', 'TECHNICAL', 'HR', 'PANEL', 'FINAL'],
      default: 'VIDEO',
      required: true,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'RESCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED',
      required: true,
      index: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    durationMinutes: {
      type: Number,
      default: 45,
      required: true,
    },
    timeZone: {
      type: String,
      default: 'UTC',
      required: true,
    },
    locationOrLink: {
      type: String,
      trim: true,
    },
    platform: {
      type: String,
      trim: true,
      default: 'Google Meet',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    rescheduledFrom: {
      type: Schema.Types.ObjectId,
      ref: 'Interview',
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

interviewSchema.index({ employer: 1, scheduledAt: -1 });
interviewSchema.index({ candidate: 1, scheduledAt: -1 });
interviewSchema.index({ application: 1, status: 1 });

export const Interview: Model<IInterview> = model<IInterview>('Interview', interviewSchema);
