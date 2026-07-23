import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IApplicationActivity extends Document {
  application: Types.ObjectId;
  actor: Types.ObjectId;
  activityType:
    | 'SUBMITTED'
    | 'STATUS_CHANGED'
    | 'NOTE_ADDED'
    | 'NOTE_DELETED'
    | 'RATED'
    | 'FLAGGED'
    | 'UNFLAGGED'
    | 'WITHDRAWN'
    | 'RESUME_UPDATED';
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const applicationActivitySchema = new Schema<IApplicationActivity>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityType: {
      type: String,
      required: true,
      enum: [
        'SUBMITTED',
        'STATUS_CHANGED',
        'NOTE_ADDED',
        'NOTE_DELETED',
        'RATED',
        'FLAGGED',
        'UNFLAGGED',
        'WITHDRAWN',
        'RESUME_UPDATED',
      ],
    },
    description: {
      type: String,
      required: true,
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

applicationActivitySchema.index({ application: 1, createdAt: -1 });

export const ApplicationActivity: Model<IApplicationActivity> = model<IApplicationActivity>(
  'ApplicationActivity',
  applicationActivitySchema
);
