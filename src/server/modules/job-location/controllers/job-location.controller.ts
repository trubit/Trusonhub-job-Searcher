import { Request, Response, NextFunction } from 'express';
import { JobLocationService } from '../services/job-location.service.js';

export class JobLocationController {
  private service = new JobLocationService();

  getLocations = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const locations = await this.service.getLocations();
      res.status(200).json({ success: true, data: locations });
    } catch (error) {
      next(error);
    }
  };

  createLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name } = req.body;
      const location = await this.service.createLocation(name);
      res.status(201).json({ success: true, message: 'Location created successfully', data: location });
    } catch (error) {
      next(error);
    }
  };

  deleteLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.deleteLocation(id);
      res.status(200).json({ success: true, message: 'Location deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
