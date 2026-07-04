import { Schema, model, Document, Model } from 'mongoose';

export interface IJobCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobCategorySchema = new Schema<IJobCategory>(
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
    description: {
      type: String,
      trim: true,
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

export const JobCategory: Model<IJobCategory> = model<IJobCategory>('JobCategory', jobCategorySchema);
