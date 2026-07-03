import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IEmailVerification extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const emailVerificationSchema = new Schema<IEmailVerification>(
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

export const EmailVerification: Model<IEmailVerification> = model<IEmailVerification>(
  'EmailVerification',
  emailVerificationSchema
);
