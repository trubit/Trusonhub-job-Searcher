import { Request, Response, NextFunction } from 'express';
import { HiringService } from '../services/hiring.service.js';

export class HiringController {
  private service = new HiringService();

  makeDecision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user!._id.toString();
      const result = await this.service.makeDecision(actorId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getApplicationDecisions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const result = await this.service.getApplicationDecisions(applicationId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}
