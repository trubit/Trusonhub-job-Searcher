import { Request, Response, NextFunction } from 'express';
import { AtsService } from '../services/ats.service.js';
import {
  updateStatusSchema,
  updateRatingSchema,
  toggleFlagSchema,
  createNoteSchema,
  bulkUpdateSchema,
} from '../schemas/ats.schema.js';

export class AtsController {
  private service = new AtsService();

  getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const jobId = req.query.jobId as string | undefined;
      const metrics = await this.service.getEmployerMetrics(employerId, jobId);
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  };

  getApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const result = await this.service.getApplications({
        employerId,
        jobId: req.query.jobId as string,
        status: req.query.status as string,
        experienceLevel: req.query.experienceLevel as string,
        location: req.query.location as string,
        minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 15,
        sortBy: req.query.sortBy as never,
      });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getApplicationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const { id } = req.params;
      const application = await this.service.getApplicationById(id, employerId);
      res.status(200).json({ success: true, data: application });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const { id } = req.params;
      const validated = updateStatusSchema.parse(req.body);
      const updated = await this.service.updateStatus(id, employerId, validated);
      res.status(200).json({ success: true, message: 'Status updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  };

  updateRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const { id } = req.params;
      const validated = updateRatingSchema.parse(req.body);
      const updated = await this.service.updateRating(id, employerId, validated);
      res.status(200).json({ success: true, message: 'Rating updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  };

  toggleFlag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const { id } = req.params;
      const validated = toggleFlagSchema.parse(req.body);
      const updated = await this.service.toggleFlag(id, employerId, validated);
      res.status(200).json({ success: true, message: 'Flag updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  };

  getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const { id } = req.params;
      const notes = await this.service.getNotes(id, employerId);
      res.status(200).json({ success: true, data: notes });
    } catch (error) {
      next(error);
    }
  };

  addNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const { id } = req.params;
      const validated = createNoteSchema.parse(req.body);
      const note = await this.service.addNote(id, employerId, validated);
      res.status(201).json({ success: true, message: 'Note added successfully', data: note });
    } catch (error) {
      next(error);
    }
  };

  deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const { id, noteId } = req.params;
      await this.service.deleteNote(noteId, id, employerId);
      res.status(200).json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  bulkUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const validated = bulkUpdateSchema.parse(req.body);
      const result = await this.service.bulkUpdate(employerId, validated);
      res.status(200).json({ success: true, message: `${result.updatedCount} applications updated`, data: result });
    } catch (error) {
      next(error);
    }
  };
}
