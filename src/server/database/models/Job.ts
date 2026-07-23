import { Schema, model, Document, Model, Types } from 'mongoose';

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
export type JobVisibility = 'PUBLIC' | 'PRIVATE';
export type SalaryType = 'HOURLY' | 'MONTHLY' | 'YEARLY' | 'COMMISSION' | 'NEGOTIABLE';
export type RemoteOption = 'REMOTE' | 'HYBRID' | 'ON_SITE';

export interface IJob extends Document {
  title: string;
  slug: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  qualifications?: string;
  
  // Employment
  employmentType: string;
  category: string; // Category slug e.g. "software-development"
  experienceLevel: 'ENTRY_LEVEL' | 'JUNIOR' | 'MID_LEVEL' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
  careerLevel?: string;
  industry?: string;
  department?: string;

  // Compensation
  salaryType: SalaryType;
  minimumSalary?: number;
  maximumSalary?: number;
  currency: string;
  salaryVisibility: 'PUBLIC' | 'PRIVATE';

  // Location
  country: string;
  state?: string;
  city: string;
  remoteOption: RemoteOption;
  workplaceType?: string;

  // Details
  vacancies?: number;
  applicationDeadline?: Date;
  benefits?: string[];
  requiredSkills?: string[];
  languages?: string[];
  tags?: string[];

  // Relationships
  employer: Types.ObjectId;
  company: Types.ObjectId;

  // Status/Visibility
  status: JobStatus;
  visibility: JobVisibility;

  // Stats
  totalViews: number;
  uniqueViews: number;
  totalSaves: number;

  // Soft Delete
  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
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
      required: true,
    },
    responsibilities: {
      type: String,
    },
    requirements: {
      type: String,
    },
    qualifications: {
      type: String,
    },
    employmentType: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'EXECUTIVE'],
      required: true,
      index: true,
    },
    careerLevel: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
      index: true,
    },
    department: {
      type: String,
      trim: true,
    },
    salaryType: {
      type: String,
      enum: ['HOURLY', 'MONTHLY', 'YEARLY', 'COMMISSION', 'NEGOTIABLE'],
      default: 'NEGOTIABLE',
    },
    minimumSalary: {
      type: Number,
    },
    maximumSalary: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
    },
    salaryVisibility: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE'],
      default: 'PUBLIC',
    },
    country: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    remoteOption: {
      type: String,
      enum: ['REMOTE', 'HYBRID', 'ON_SITE'],
      required: true,
      index: true,
    },
    workplaceType: {
      type: String,
      trim: true,
    },
    vacancies: {
      type: Number,
      default: 1,
    },
    applicationDeadline: {
      type: Date,
    },
    benefits: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
      index: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    visibility: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE'],
      default: 'PUBLIC',
      index: true,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    uniqueViews: {
      type: Number,
      default: 0,
    },
    totalSaves: {
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

// High-performance compound indexes for search & filtering
jobSchema.index({ isDeleted: 1, status: 1, visibility: 1, createdAt: -1 });
jobSchema.index({ isDeleted: 1, company: 1, status: 1 });
jobSchema.index({ isDeleted: 1, employer: 1 });
jobSchema.index({ category: 1, isDeleted: 1, status: 1 });
jobSchema.index({ country: 1, city: 1, isDeleted: 1, status: 1 });
jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text', tags: 'text' });

export const Job: Model<IJob> = model<IJob>('Job', jobSchema);
