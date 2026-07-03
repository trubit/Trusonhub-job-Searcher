import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IResume extends Document {
  user: Types.ObjectId;
  fileName: string;
  fileUrl: string;
  publicId: string;
  fileSizeBytes: number;
  mimeType: string;
  isPrimary: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    fileSizeBytes: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    isPrimary: {
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

export const Resume: Model<IResume> = model<IResume>('Resume', resumeSchema);
