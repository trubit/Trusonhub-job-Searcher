import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IJobReport extends Document {
  job: Types.ObjectId;
  user: Types.ObjectId;
  reason: string;
  details?: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: Date;
  updatedAt: Date;
}

const jobReportSchema = new Schema<IJobReport>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'RESOLVED'],
      default: 'PENDING',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const JobReport: Model<IJobReport> = model<IJobReport>('JobReport', jobReportSchema);
