import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IEmployerProfile extends Document {
  user: Types.ObjectId;
  position: string;
  department?: string;
  businessEmail: string;
  phone?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employerProfileSchema = new Schema<IEmployerProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    businessEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
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

export const EmployerProfile: Model<IEmployerProfile> = model<IEmployerProfile>(
  'EmployerProfile',
  employerProfileSchema
);
