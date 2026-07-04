import { Schema, model, Document, Model, Types } from 'mongoose';

export type ApplicationStatus = 'SUBMITTED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface IJobApplication extends Document {
  job: Types.ObjectId;
  applicant: Types.ObjectId;
  resume: Types.ObjectId;
  coverLetter?: string;
  status: ApplicationStatus;
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
    resume: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'],
      default: 'SUBMITTED',
      index: true,
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

export const JobApplication: Model<IJobApplication> = model<IJobApplication>('JobApplication', jobApplicationSchema);
export default JobApplication;
