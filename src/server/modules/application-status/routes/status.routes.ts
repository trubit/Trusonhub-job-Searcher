import { Router, Request, Response, NextFunction } from 'express';
import { ApplicationStatus, ApplicationStage } from '../../../database/models/ApplicationStatus.js';

const router = Router();

const DEFAULT_STAGES: { code: ApplicationStage; label: string; color: string; order: number }[] = [
  { code: 'DRAFT', label: 'Draft', color: '#64748b', order: 0 },
  { code: 'SUBMITTED', label: 'Submitted', color: '#3b82f6', order: 1 },
  { code: 'UNDER_REVIEW', label: 'Under Review', color: '#8b5cf6', order: 2 },
  { code: 'SHORTLISTED', label: 'Shortlisted', color: '#ec4899', order: 3 },
  { code: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', color: '#06b6d4', order: 4 },
  { code: 'INTERVIEW_COMPLETED', label: 'Interview Completed', color: '#0284c7', order: 5 },
  { code: 'ASSESSMENT_PENDING', label: 'Assessment Pending', color: '#f59e0b', order: 6 },
  { code: 'OFFER_EXTENDED', label: 'Offer Extended', color: '#eab308', order: 7 },
  { code: 'OFFER_ACCEPTED', label: 'Offer Accepted', color: '#10b981', order: 8 },
  { code: 'OFFER_DECLINED', label: 'Offer Declined', color: '#f97316', order: 9 },
  { code: 'HIRED', label: 'Hired', color: '#22c55e', order: 10 },
  { code: 'REJECTED', label: 'Rejected', color: '#ef4444', order: 11 },
  { code: 'WITHDRAWN', label: 'Withdrawn', color: '#64748b', order: 12 },
];

router.get('/application-statuses', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let statuses = await ApplicationStatus.find({ isActive: true }).sort({ order: 1 });

    if (statuses.length === 0) {
      statuses = await ApplicationStatus.insertMany(
        DEFAULT_STAGES.map((s) => ({ ...s, isActive: true, isSystem: true }))
      );
    }

    res.status(200).json({ success: true, data: statuses });
  } catch (error) {
    next(error);
  }
});

export default router;
