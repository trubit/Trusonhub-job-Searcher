import { Schema, model, Document, Model } from 'mongoose';

export interface IJobLocation extends Document {
  name: string;
  slug: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobLocationSchema = new Schema<IJobLocation>(
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

export const JobLocation: Model<IJobLocation> = model<IJobLocation>('JobLocation', jobLocationSchema);
