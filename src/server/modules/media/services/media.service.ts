import { Media, IMedia, MediaType } from '../../../database/models/Media.js';
import { User } from '../../../database/models/User.js';
import { Company } from '../../../database/models/Company.js';
import { cloudinaryService } from '../../../services/cloudinaryService.js';
import { AppError } from '../../../utils/AppError.js';

export class MediaService {
  async uploadImage(
    userId: string,
    fileBuffer: Buffer,
    assetType: MediaType,
    targetId?: string
  ): Promise<IMedia> {
    const folderMap: Record<MediaType, string> = {
      PROFILE_PHOTO: 'avatars',
      COMPANY_LOGO: 'logos',
      COVER_IMAGE: 'covers',
      GALLERY: 'gallery',
      RESUME: 'resumes',
    };

    const folder = folderMap[assetType] || 'general';
    const { url, publicId, bytes } = await cloudinaryService.uploadImage(fileBuffer, folder);

    const media = await Media.create({
      user: userId,
      publicId,
      url,
      assetType,
      bytes,
    });

    // Automatically bind to target entity
    if (assetType === 'PROFILE_PHOTO') {
      await User.findByIdAndUpdate(userId, { avatarUrl: url });
    } else if (assetType === 'COMPANY_LOGO' && targetId) {
      await Company.findOneAndUpdate({ _id: targetId, owner: userId }, { logoUrl: url });
    } else if (assetType === 'COVER_IMAGE' && targetId) {
      await Company.findOneAndUpdate({ _id: targetId, owner: userId }, { coverImageUrl: url });
    } else if (assetType === 'GALLERY' && targetId) {
      await Company.findOneAndUpdate(
        { _id: targetId, owner: userId },
        { $push: { gallery: { url, publicId, sortOrder: 0 } } }
      );
    }

    return media;
  }

  async deleteMedia(mediaId: string, userId: string): Promise<void> {
    const media = await Media.findOne({ _id: mediaId, user: userId, isDeleted: false });
    if (!media) {
      throw new AppError('Media asset not found', 404, 'NOT_FOUND');
    }

    await cloudinaryService.deleteAsset(media.publicId);
    media.isDeleted = true;
    media.deletedAt = new Date();
    await media.save();

    // Pull or unset from Company
    if (media.assetType === 'GALLERY') {
      await Company.updateMany(
        { owner: userId },
        { $pull: { gallery: { publicId: media.publicId } } }
      );
    } else if (media.assetType === 'COMPANY_LOGO') {
      await Company.updateMany(
        { owner: userId, logoUrl: media.url },
        { $unset: { logoUrl: '' } }
      );
    } else if (media.assetType === 'COVER_IMAGE') {
      await Company.updateMany(
        { owner: userId, coverImageUrl: media.url },
        { $unset: { coverImageUrl: '' } }
      );
    }
  }
}
