import { Schema, model, Document, Model, Types } from 'mongoose';

export type DecisionType = 'APPROVED' | 'REJECTED' | 'HOLD' | 'ESCALATED';

export interface IHiringDecision extends Document {
  _id: Types.ObjectId;
  application: Types.ObjectId;
  job: Types.ObjectId;
  candidate: Types.ObjectId;
  decidedBy: Types.ObjectId;
  decision: DecisionType;
  reason?: string;
  notes?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hiringDecisionSchema = new Schema<IHiringDecision>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    decidedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    decision: {
      type: String,
      enum: ['APPROVED', 'REJECTED', 'HOLD', 'ESCALATED'],
      required: true,
      index: true,
    },
    reason: {
      type: String,
      maxlength: 1000,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

hiringDecisionSchema.index({ application: 1, createdAt: -1 });

export const HiringDecision: Model<IHiringDecision> = model<IHiringDecision>('HiringDecision', hiringDecisionSchema);
