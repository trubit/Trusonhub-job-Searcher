import { Request, Response, NextFunction } from 'express';
import { JobTypeService } from '../services/job-type.service.js';

export class JobTypeController {
  private service = new JobTypeService();

  getTypes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const types = await this.service.getTypes();
      res.status(200).json({ success: true, data: types });
    } catch (error) {
      next(error);
    }
  };

  createType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name } = req.body;
      const type = await this.service.createType(name);
      res.status(201).json({ success: true, message: 'Job type created successfully', data: type });
    } catch (error) {
      next(error);
    }
  };

  deleteType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.deleteType(id);
      res.status(200).json({ success: true, message: 'Job type deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
