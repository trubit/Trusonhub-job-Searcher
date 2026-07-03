import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  passwordHash: string;
  avatarUrl?: string;
  companyName?: string; // Optional field for Employer accounts
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLoginAt?: Date;

  // Security & Lockout
  passwordChangedAt?: Date;
  failedLoginAttempts: number;
  accountLockedUntil?: Date;
  refreshTokenVersion: number;

  // Soft Delete
  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    companyName: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'EMPLOYER', 'JOB_SEEKER'],
      default: 'JOB_SEEKER',
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'],
      default: 'ACTIVE',
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedUntil: {
      type: Date,
      default: null,
    },
    refreshTokenVersion: {
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

// Method to compare candidate password against hashed password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User: Model<IUser> = model<IUser>('User', userSchema);
