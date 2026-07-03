import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IJobSeekerProfile extends Document {
  user: Types.ObjectId;
  headline?: string;
  about?: string;
  phoneNumber?: string;
  location: {
    country: string;
    state: string;
    city: string;
    address?: string;
  };
  currentPosition?: string;
  yearsOfExperience: number;
  industry?: string;
  employmentStatus: 'EMPLOYED' | 'UNEMPLOYED' | 'OPEN_TO_WORK' | 'FREELANCING';
  preferredJobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'ANY';
  preferredWorkMode: 'REMOTE' | 'HYBRID' | 'ON_SITE' | 'ANY';
  expectedSalary?: string;
  socialLinks: {
    portfolio?: string;
    github?: string;
    linkedin?: string;
    behance?: string;
    dribbble?: string;
    personal?: string;
  };
  completionPercentage: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobSeekerProfileSchema = new Schema<IJobSeekerProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    headline: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    location: {
      country: { type: String, default: '' },
      state: { type: String, default: '' },
      city: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    currentPosition: {
      type: String,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    industry: {
      type: String,
      trim: true,
    },
    employmentStatus: {
      type: String,
      enum: ['EMPLOYED', 'UNEMPLOYED', 'OPEN_TO_WORK', 'FREELANCING'],
      default: 'OPEN_TO_WORK',
    },
    preferredJobType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'ANY'],
      default: 'FULL_TIME',
    },
    preferredWorkMode: {
      type: String,
      enum: ['REMOTE', 'HYBRID', 'ON_SITE', 'ANY'],
      default: 'REMOTE',
    },
    expectedSalary: {
      type: String,
      trim: true,
    },
    socialLinks: {
      portfolio: { type: String, trim: true },
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      behance: { type: String, trim: true },
      dribbble: { type: String, trim: true },
      personal: { type: String, trim: true },
    },
    completionPercentage: {
      type: Number,
      default: 0,
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

export const JobSeekerProfile: Model<IJobSeekerProfile> = model<IJobSeekerProfile>(
  'JobSeekerProfile',
  jobSeekerProfileSchema
);
