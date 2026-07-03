import { Schema, model, Document, Model } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  category: 'JOBS' | 'COMPANIES' | 'USERS' | 'SYSTEM';
  description: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['JOBS', 'COMPANIES', 'USERS', 'SYSTEM'],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
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

export const Permission: Model<IPermission> = model<IPermission>('Permission', permissionSchema);
