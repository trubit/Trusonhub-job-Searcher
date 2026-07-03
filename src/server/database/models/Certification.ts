import { Schema, model, Document, Model, Types } from 'mongoose';

export interface ICertification extends Document {
  user: Types.ObjectId;
  name: string;
  organization: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const certificationSchema = new Schema<ICertification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    credentialUrl: {
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

export const Certification: Model<ICertification> = model<ICertification>('Certification', certificationSchema);
