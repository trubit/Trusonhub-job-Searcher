import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';

const router = Router();
const controller = new ApplicationController();

router.use(authenticate);

// Candidates actions
router.post('/', authorize('JOB_SEEKER'), controller.createApplication);
router.get('/my', authorize('JOB_SEEKER'), controller.getMyApplications);

// Employers / Admins actions
router.get('/job/:jobId', authorize('EMPLOYER', 'ADMIN'), controller.getJobApplications);
router.put('/:id/status', authorize('EMPLOYER', 'ADMIN'), controller.updateApplicationStatus);

export default router;
