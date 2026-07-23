import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IApplicationNotes extends Document {
  application: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const applicationNotesSchema = new Schema<IApplicationNotes>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

applicationNotesSchema.index({ application: 1, isPinned: -1, createdAt: -1 });

export const ApplicationNotes: Model<IApplicationNotes> = model<IApplicationNotes>(
  'ApplicationNotes',
  applicationNotesSchema
);
