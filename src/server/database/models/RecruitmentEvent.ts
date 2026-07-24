import { Schema, model, Document, Model, Types } from 'mongoose';

export type EventType =
  | 'APPLICATION_SUBMITTED'
  | 'STATUS_CHANGED'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_RESCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'INTERVIEW_CANCELLED'
  | 'FEEDBACK_SUBMITTED'
  | 'HIRING_DECISION_MADE'
  | 'OFFER_CREATED'
  | 'OFFER_SENT'
  | 'OFFER_ACCEPTED'
  | 'OFFER_DECLINED'
  | 'OFFER_WITHDRAWN';

export interface IRecruitmentEvent extends Document {
  _id: Types.ObjectId;
  eventType: EventType;
  applicationId: Types.ObjectId;
  jobId?: Types.ObjectId;
  candidateId?: Types.ObjectId;
  actorId?: Types.ObjectId;
  payload: Record<string, unknown>;
  createdAt: Date;
}

const recruitmentEventSchema = new Schema<IRecruitmentEvent>(
  {
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      index: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

recruitmentEventSchema.index({ applicationId: 1, createdAt: -1 });

export const RecruitmentEvent: Model<IRecruitmentEvent> = model<IRecruitmentEvent>(
  'RecruitmentEvent',
  recruitmentEventSchema
);
