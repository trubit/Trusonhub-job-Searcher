import { Router, Request, Response } from 'express';
import { User } from '../database/models/User.js';
import { Job } from '../database/models/Job.js';
import { Company } from '../database/models/Company.js';
import { JobApplication } from '../database/models/JobApplication.js';

const router = Router();

/**
 * GET /api/v1/stats/public
 * Returns public platform statistics shown on the landing page.
 * No authentication required.
 */
router.get('/public', async (_req: Request, res: Response) => {
  try {
    const [totalJobs, totalCompanies, totalCandidates, totalApplications] = await Promise.all([
      Job.countDocuments({ isDeleted: false, status: 'PUBLISHED' }),
      Company.countDocuments({ isDeleted: false }),
      User.countDocuments({ role: 'JOB_SEEKER', isDeleted: false }),
      JobApplication.countDocuments({ isDeleted: false }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalCompanies,
        totalCandidates,
        totalApplications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load stats' });
  }
});

export default router;
