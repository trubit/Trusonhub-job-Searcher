import { Schema, model, Document, Model, Types } from 'mongoose';

export interface ISkill extends Document {
  user: Types.ObjectId;
  name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
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
      index: true,
    },
    level: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
      default: 'INTERMEDIATE',
    },
    yearsOfExperience: {
      type: Number,
      default: 1,
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

export const Skill: Model<ISkill> = model<ISkill>('Skill', skillSchema);
