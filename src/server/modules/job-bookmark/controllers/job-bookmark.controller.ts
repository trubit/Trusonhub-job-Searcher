import { Request, Response, NextFunction } from 'express';
import { JobBookmarkService } from '../services/job-bookmark.service.js';

export class JobBookmarkController {
  private service = new JobBookmarkService();

  bookmarkJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const bookmark = await this.service.bookmarkJob(userId, id);
      res.status(201).json({ success: true, message: 'Job bookmarked successfully', data: bookmark });
    } catch (error) {
      next(error);
    }
  };

  unbookmarkJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      await this.service.unbookmarkJob(userId, id);
      res.status(200).json({ success: true, message: 'Job bookmark removed successfully' });
    } catch (error) {
      next(error);
    }
  };

  getBookmarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const bookmarks = await this.service.getSavedJobs(userId);
      res.status(200).json({ success: true, data: bookmarks });
    } catch (error) {
      next(error);
    }
  };
}
