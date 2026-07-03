import { Resume, IResume } from '../../../database/models/Resume.js';
import { cloudinaryService } from '../../../services/cloudinaryService.js';
import { AppError } from '../../../utils/AppError.js';

export class ResumeService {
  async getResumes(userId: string): Promise<IResume[]> {
    return Resume.find({ user: userId, isDeleted: false }).sort({ createdAt: -1 });
  }

  async uploadResume(userId: string, fileBuffer: Buffer, fileName: string, mimeType: string): Promise<IResume> {
    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new AppError('Only PDF, DOC, and DOCX resume formats are supported.', 400, 'INVALID_FILE_TYPE');
    }

    // Maximum 10MB
    if (fileBuffer.length > 10 * 1024 * 1024) {
      throw new AppError('Resume file size cannot exceed 10MB.', 400, 'FILE_TOO_LARGE');
    }

    const { url, publicId, bytes } = await cloudinaryService.uploadDocument(fileBuffer, userId, fileName);

    // If first resume, set as primary
    const existingCount = await Resume.countDocuments({ user: userId, isDeleted: false });
    const isPrimary = existingCount === 0;

    return Resume.create({
      user: userId,
      fileName,
      fileUrl: url,
      publicId,
      fileSizeBytes: bytes,
      mimeType,
      isPrimary,
    });
  }

  async deleteResume(id: string, userId: string): Promise<void> {
    const resume = await Resume.findOne({ _id: id, user: userId, isDeleted: false });
    if (!resume) {
      throw new AppError('Resume not found', 404, 'NOT_FOUND');
    }

    await cloudinaryService.deleteAsset(resume.publicId, 'raw');
    resume.isDeleted = true;
    resume.deletedAt = new Date();
    await resume.save();
  }

  async setPrimaryResume(id: string, userId: string): Promise<IResume> {
    const resume = await Resume.findOne({ _id: id, user: userId, isDeleted: false });
    if (!resume) {
      throw new AppError('Resume not found', 404, 'NOT_FOUND');
    }

    await Resume.updateMany({ user: userId }, { isPrimary: false });
    resume.isPrimary = true;
    return resume.save();
  }
}
