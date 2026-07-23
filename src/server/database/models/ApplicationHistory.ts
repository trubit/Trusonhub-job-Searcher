import { Schema, model, Document, Model, Types } from 'mongoose';
import { ApplicationStage } from './ApplicationStatus.js';

export interface IApplicationHistory extends Document {
  application: Types.ObjectId;
  previousStatus?: ApplicationStage;
  newStatus: ApplicationStage;
  action: string;
  performedBy: Types.ObjectId;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const applicationHistorySchema = new Schema<IApplicationHistory>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    previousStatus: {
      type: String,
    },
    newStatus: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

applicationHistorySchema.index({ application: 1, createdAt: -1 });

export const ApplicationHistory: Model<IApplicationHistory> = model<IApplicationHistory>(
  'ApplicationHistory',
  applicationHistorySchema
);
