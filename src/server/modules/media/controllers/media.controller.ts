import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { MediaService } from '../services/media.service.js';
import { MediaType } from '../../../database/models/Media.js';
import { AppError } from '../../../utils/AppError.js';

export const uploadMediaMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB image limit
});

export class MediaController {
  private service = new MediaService();

  uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const file = req.file;
      if (!file) {
        throw new AppError('No image file provided', 400, 'FILE_MISSING');
      }

      const assetType = (req.body.assetType as MediaType) || 'PROFILE_PHOTO';
      const targetId = req.body.targetId;

      const media = await this.service.uploadImage(userId, file.buffer, assetType, targetId);
      res.status(201).json({ success: true, message: 'Image uploaded successfully', data: media });
    } catch (error) {
      next(error);
    }
  };

  deleteMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      await this.service.deleteMedia(id, userId);
      res.status(200).json({ success: true, message: 'Media deleted' });
    } catch (error) {
      next(error);
    }
  };
}
