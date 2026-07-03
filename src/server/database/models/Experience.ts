import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IExperience extends Document {
  user: Types.ObjectId;
  companyName: string;
  position: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  responsibilities?: string;
  achievements?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP'],
      default: 'FULL_TIME',
    },
    location: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    responsibilities: {
      type: String,
      trim: true,
    },
    achievements: {
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

export const Experience: Model<IExperience> = model<IExperience>('Experience', experienceSchema);
