import { Router, Request, Response, NextFunction } from 'express';
import { ApplicationHistory } from '../../../database/models/ApplicationHistory.js';
import { ApplicationActivity } from '../../../database/models/ApplicationActivity.js';
import { JobApplication } from '../../../database/models/JobApplication.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { AppError } from '../../../utils/AppError.js';

const router = Router();

router.use(authenticate);

router.get('/applications/:id/history', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const application = await JobApplication.findById(id);
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.applicant.toString() !== userId && application.employer.toString() !== userId && req.user!.role !== 'ADMIN') {
      throw new AppError('Unauthorized to view application history', 403);
    }

    const history = await ApplicationHistory.find({ application: id })
      .populate('performedBy', 'firstName lastName email avatarUrl role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
});

router.get('/applications/:id/activity', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const application = await JobApplication.findById(id);
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.applicant.toString() !== userId && application.employer.toString() !== userId && req.user!.role !== 'ADMIN') {
      throw new AppError('Unauthorized to view application activity', 403);
    }

    const activity = await ApplicationActivity.find({ application: id })
      .populate('actor', 'firstName lastName email avatarUrl role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
});

export default router;
