import { Schema, model, Document, Model, Types } from 'mongoose';

export type OfferStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN' | 'EXPIRED';

export interface IJobOffer extends Document {
  _id: Types.ObjectId;
  application: Types.ObjectId;
  job: Types.ObjectId;
  candidate: Types.ObjectId;
  employer: Types.ObjectId;
  positionTitle: string;
  salary: number;
  currency: string;
  benefits: string[];
  startDate: Date;
  expirationDate: Date;
  terms?: string;
  status: OfferStatus;
  declineReason?: string;
  withdrawalReason?: string;
  version: number;
  acceptedAt?: Date;
  declinedAt?: Date;
  sentAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const jobOfferSchema = new Schema<IJobOffer>(
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
    employer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    positionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      required: true,
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    terms: {
      type: String,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'WITHDRAWN', 'EXPIRED'],
      default: 'DRAFT',
      required: true,
      index: true,
    },
    declineReason: {
      type: String,
      maxlength: 1000,
    },
    withdrawalReason: {
      type: String,
      maxlength: 1000,
    },
    version: {
      type: Number,
      default: 1,
      required: true,
    },
    acceptedAt: Date,
    declinedAt: Date,
    sentAt: Date,
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

jobOfferSchema.index({ application: 1, version: -1 });
jobOfferSchema.index({ candidate: 1, status: 1 });
jobOfferSchema.index({ employer: 1, status: 1 });

export const JobOffer: Model<IJobOffer> = model<IJobOffer>('JobOffer', jobOfferSchema);
