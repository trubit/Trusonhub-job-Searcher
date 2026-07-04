import { Router } from 'express';
import { JobController } from '../controllers/job.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authenticateOptional } from '../../../middleware/authenticateOptional.js';
import { authorize } from '../../../middleware/authorize.js';
import { validate } from '../../../middleware/validate.js';
import { jobCreateSchema, jobUpdateSchema } from '../schemas/job.schema.js';

const router = Router();
const controller = new JobController();

// Public search and fetch routes
router.get('/search', controller.searchJobs);
router.get('/company/:id', controller.getCompanyJobs);
router.get('/:slug', authenticateOptional, controller.getJobBySlug);
router.get('/', controller.searchJobs);

// Protected routes (Employer/Admin)
router.post('/', authenticate, authorize('EMPLOYER', 'ADMIN'), validate(jobCreateSchema), controller.createJob);
router.put('/:id', authenticate, authorize('EMPLOYER', 'ADMIN'), validate(jobUpdateSchema), controller.updateJob);
router.delete('/:id', authenticate, authorize('EMPLOYER', 'ADMIN'), controller.deleteJob);
router.post('/:id/duplicate', authenticate, authorize('EMPLOYER', 'ADMIN'), controller.duplicateJob);

export default router;
