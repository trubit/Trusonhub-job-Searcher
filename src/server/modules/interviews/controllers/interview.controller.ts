import { Request, Response, NextFunction } from 'express';
import { InterviewService } from '../services/interview.service.js';

export class InterviewController {
  private service = new InterviewService();

  scheduleInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const result = await this.service.scheduleInterview(employerId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.service.getInterviewById(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getMyInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const role = req.user!.role;
      const result =
        role === 'JOB_SEEKER'
          ? await this.service.getCandidateInterviews(userId)
          : await this.service.getEmployerInterviews(userId);

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getApplicationInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const result = await this.service.getApplicationInterviews(applicationId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const actorId = req.user!._id.toString();
      const result = await this.service.updateInterviewStatus(id, actorId, status, reason);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  updateInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const actorId = req.user!._id.toString();
      const result = await this.service.updateInterview(id, actorId, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  submitFeedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const interviewerId = req.user!._id.toString();
      const result = await this.service.submitFeedback(id, interviewerId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getFeedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.service.getInterviewFeedback(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}
