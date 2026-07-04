import { Schema, model, Document, Model } from 'mongoose';

export interface IJobType extends Document {
  name: string;
  slug: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobTypeSchema = new Schema<IJobType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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

export const JobType: Model<IJobType> = model<IJobType>('JobType', jobTypeSchema);
