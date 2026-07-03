import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ResumeService } from '../services/resume.service.js';
import { AppError } from '../../../utils/AppError.js';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export class ResumeController {
  private service = new ResumeService();

  getResumes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const resumes = await this.service.getResumes(userId);
      res.status(200).json({ success: true, data: resumes });
    } catch (error) {
      next(error);
    }
  };

  uploadResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const file = req.file;
      if (!file) {
        throw new AppError('No resume file provided', 400, 'FILE_MISSING');
      }

      const resume = await this.service.uploadResume(userId, file.buffer, file.originalname, file.mimetype);
      res.status(201).json({ success: true, message: 'Resume uploaded successfully', data: resume });
    } catch (error) {
      next(error);
    }
  };

  deleteResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      await this.service.deleteResume(id, userId);
      res.status(200).json({ success: true, message: 'Resume deleted' });
    } catch (error) {
      next(error);
    }
  };

  setPrimary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const primary = await this.service.setPrimaryResume(id, userId);
      res.status(200).json({ success: true, message: 'Primary resume updated', data: primary });
    } catch (error) {
      next(error);
    }
  };
}
