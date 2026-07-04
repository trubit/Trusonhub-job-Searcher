import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IJobView extends Document {
  job: Types.ObjectId;
  user?: Types.ObjectId;
  ipHash: string;
  userAgent?: string;
  createdAt: Date;
}

const jobViewSchema = new Schema<IJobView>(
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
      index: true,
    },
    ipHash: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const JobView: Model<IJobView> = model<IJobView>('JobView', jobViewSchema);
