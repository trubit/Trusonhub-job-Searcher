import { Schema, model, Document, Model, Types } from 'mongoose';

export type MediaType = 'PROFILE_PHOTO' | 'COMPANY_LOGO' | 'COVER_IMAGE' | 'GALLERY' | 'RESUME';

export interface IMedia extends Document {
  user: Types.ObjectId;
  publicId: string;
  url: string;
  assetType: MediaType;
  bytes: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    publicId: {
      type: String,
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    assetType: {
      type: String,
      enum: ['PROFILE_PHOTO', 'COMPANY_LOGO', 'COVER_IMAGE', 'GALLERY', 'RESUME'],
      required: true,
    },
    bytes: {
      type: Number,
      default: 0,
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

export const Media: Model<IMedia> = model<IMedia>('Media', mediaSchema);
