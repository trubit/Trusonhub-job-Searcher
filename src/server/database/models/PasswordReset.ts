import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IPasswordReset extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PasswordReset: Model<IPasswordReset> = model<IPasswordReset>(
  'PasswordReset',
  passwordResetSchema
);
