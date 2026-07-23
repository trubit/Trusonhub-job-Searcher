import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IApplicationAttachments extends Document {
  application: Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  publicId?: string;
  createdAt: Date;
}

const applicationAttachmentsSchema = new Schema<IApplicationAttachments>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    publicId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

applicationAttachmentsSchema.index({ application: 1, createdAt: -1 });

export const ApplicationAttachments: Model<IApplicationAttachments> = model<IApplicationAttachments>(
  'ApplicationAttachments',
  applicationAttachmentsSchema
);
