import { Schema, model, Document, Model, Types } from 'mongoose';

export type UserRoleType = 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER';

export interface IRole extends Document {
  name: UserRoleType;
  description: string;
  permissions: Types.ObjectId[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      enum: ['ADMIN', 'EMPLOYER', 'JOB_SEEKER'],
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
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

export const Role: Model<IRole> = model<IRole>('Role', roleSchema);
