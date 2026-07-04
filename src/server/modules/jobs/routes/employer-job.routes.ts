import { Router } from 'express';
import { JobController } from '../controllers/job.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';

const router = Router();
const controller = new JobController();

router.get('/jobs', authenticate, authorize('EMPLOYER', 'ADMIN'), controller.getEmployerJobs);

export default router;
