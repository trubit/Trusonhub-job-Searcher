import { Schema, model, Document, Model, Types } from 'mongoose';

export interface ICompanyGalleryItem {
  url: string;
  publicId: string;
  caption?: string;
  sortOrder: number;
}

export interface ICompany extends Document {
  owner: Types.ObjectId;
  name: string;
  slug: string;
  logoUrl?: string;
  coverImageUrl?: string;
  website?: string;
  industry: string;
  companySize: string; // e.g. "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"
  foundedYear?: number;
  headquarters: string;
  description: string;
  mission?: string;
  vision?: string;
  culture?: string;
  contactInfo: {
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    address: string;
  };
  socialLinks: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  gallery: ICompanyGalleryItem[];
  benefits: string[];
  isVerified: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logoUrl: {
      type: String,
      default: null,
    },
    coverImageUrl: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    companySize: {
      type: String,
      required: true,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      default: '11-50',
    },
    foundedYear: {
      type: Number,
    },
    headquarters: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    mission: { type: String, trim: true },
    vision: { type: String, trim: true },
    culture: { type: String, trim: true },
    contactInfo: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      country: { type: String, default: '' },
      state: { type: String, default: '' },
      city: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      facebook: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
      youtube: { type: String, trim: true },
    },
    gallery: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        caption: { type: String },
        sortOrder: { type: Number, default: 0 },
      },
    ],
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
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

companySchema.index({ isDeleted: 1, isVerified: 1, createdAt: -1 });
companySchema.index({ owner: 1, isDeleted: 1 });
companySchema.index({ name: 'text', industry: 'text' });

export const Company: Model<ICompany> = model<ICompany>('Company', companySchema);
