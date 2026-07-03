import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IPortfolio extends Document {
  user: Types.ObjectId;
  projectName: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  images: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    projectUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
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

export const Portfolio: Model<IPortfolio> = model<IPortfolio>('Portfolio', portfolioSchema);
