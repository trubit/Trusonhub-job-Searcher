import { Schema, model, Document, Model, Types } from 'mongoose';

export interface ISession extends Document {
  user: Types.ObjectId;
  refreshTokenHash: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  isValid: boolean;
  lastActivityAt: Date;
  expiresAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      index: true,
    },
    device: {
      type: String,
      default: 'Unknown Device',
    },
    browser: {
      type: String,
      default: 'Unknown Browser',
    },
    os: {
      type: String,
      default: 'Unknown OS',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    isValid: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatic TTL cleanup upon expiration
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

export const Session: Model<ISession> = model<ISession>('Session', sessionSchema);
