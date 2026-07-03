import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

class CloudinaryService {
  private isConfigured = false;

  constructor() {
    if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        secure: true,
      });
      this.isConfigured = true;
    }
  }

  async uploadImage(fileBuffer: Buffer, folder: string): Promise<{ url: string; publicId: string; bytes: number }> {
    if (!this.isConfigured) {
      logger.info(`[Cloudinary Dev Fallback] Image uploaded to folder: ${folder}`);
      const mockId = `mock_${folder}_${Date.now()}`;
      return {
        url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop`,
        publicId: mockId,
        bytes: fileBuffer.length,
      };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `trusonhub/${folder}`,
          type: 'upload',
          access_mode: 'public',
          transformation: [{ width: 1200, height: 1200, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }],
        },
        (error, result?: UploadApiResponse) => {
          if (error || !result) {
            logger.error('Cloudinary image upload error', { error });
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  async uploadDocument(fileBuffer: Buffer, folder: string, fileName: string): Promise<{ url: string; publicId: string; bytes: number }> {
    if (!this.isConfigured) {
      logger.info(`[Cloudinary Dev Fallback] Document uploaded: ${fileName} to folder: ${folder}`);
      const mockId = `mock_doc_${Date.now()}`;
      return {
        url: `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`,
        publicId: mockId,
        bytes: fileBuffer.length,
      };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `trusonhub/documents/${folder}`,
          resource_type: 'raw',
          type: 'upload',
          access_mode: 'public',
          public_id: `${Date.now()}_${fileName}`,
        },
        (error, result?: UploadApiResponse) => {
          if (error || !result) {
            logger.error('Cloudinary document upload error', { error });
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  async deleteAsset(publicId: string, resourceType: 'image' | 'raw' = 'image'): Promise<void> {
    if (!this.isConfigured || publicId.startsWith('mock_')) {
      logger.info(`[Cloudinary Dev Fallback] Deleted mock asset: ${publicId}`);
      return;
    }

    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      logger.info(`Deleted Cloudinary asset: ${publicId}`);
    } catch (error) {
      logger.error(`Failed to delete Cloudinary asset: ${publicId}`, { error });
    }
  }
}

export const cloudinaryService = new CloudinaryService();
