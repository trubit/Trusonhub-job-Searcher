import { Schema, model, Document, Model, Types } from 'mongoose';

export type RecommendationType = 'STRONG_HIRE' | 'RECOMMEND_HIRE' | 'NEUTRAL' | 'REJECT' | 'ANOTHER_INTERVIEW';

export interface ISkillScore {
  skill: string;
  rating: number;
}

export interface IInterviewFeedback extends Document {
  _id: Types.ObjectId;
  interview: Types.ObjectId;
  application: Types.ObjectId;
  interviewer: Types.ObjectId;
  overallRating: number;
  recommendation: RecommendationType;
  skillScores: ISkillScore[];
  strengths?: string;
  weaknesses?: string;
  comments?: string;
  isPrivate: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const interviewFeedbackSchema = new Schema<IInterviewFeedback>(
  {
    interview: {
      type: Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      index: true,
    },
    application: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    interviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    overallRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    recommendation: {
      type: String,
      enum: ['STRONG_HIRE', 'RECOMMEND_HIRE', 'NEUTRAL', 'REJECT', 'ANOTHER_INTERVIEW'],
      required: true,
    },
    skillScores: [
      {
        skill: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
      },
    ],
    strengths: {
      type: String,
      maxlength: 2000,
    },
    weaknesses: {
      type: String,
      maxlength: 2000,
    },
    comments: {
      type: String,
      maxlength: 3000,
    },
    isPrivate: {
      type: Boolean,
      default: true,
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

interviewFeedbackSchema.index({ interview: 1, interviewer: 1 }, { unique: true });

export const InterviewFeedback: Model<IInterviewFeedback> = model<IInterviewFeedback>(
  'InterviewFeedback',
  interviewFeedbackSchema
);
