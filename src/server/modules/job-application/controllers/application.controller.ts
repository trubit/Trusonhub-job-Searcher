import { Request, Response, NextFunction } from 'express';
import { JobApplicationService } from '../services/application.service.js';
import { createApplicationSchema, withdrawApplicationSchema } from '../schemas/application.schema.js';

export class JobApplicationController {
  private service = new JobApplicationService();

  apply = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicantId = req.user!._id.toString();
      const validated = createApplicationSchema.parse(req.body);
      const application = await this.service.applyToJob(applicantId, validated);
      res.status(201).json({
        success: true,
        message: validated.isDraft ? 'Application draft saved' : 'Application submitted successfully',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicantId = req.user!._id.toString();
      const applications = await this.service.getMyApplications(applicantId);
      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  };

  getApplicationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicantId = req.user!._id.toString();
      const { id } = req.params;
      const application = await this.service.getApplicationById(id, applicantId);
      res.status(200).json({ success: true, data: application });
    } catch (error) {
      next(error);
    }
  };

  withdraw = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicantId = req.user!._id.toString();
      const { id } = req.params;
      const validated = withdrawApplicationSchema.parse(req.body);
      const application = await this.service.withdrawApplication(id, applicantId, validated);
      res.status(200).json({
        success: true,
        message: 'Application withdrawn successfully',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  };
}
