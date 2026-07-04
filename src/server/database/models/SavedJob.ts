import { Schema, model, Document, Model, Types } from 'mongoose';

export interface ISavedJob extends Document {
  user: Types.ObjectId;
  job: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const savedJobSchema = new Schema<ISavedJob>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
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

savedJobSchema.index({ user: 1, job: 1 }, { unique: true });

export const SavedJob: Model<ISavedJob> = model<ISavedJob>('SavedJob', savedJobSchema);
