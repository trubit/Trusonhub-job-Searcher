import { Router } from 'express';
import { JobApplicationController } from '../controllers/application.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';

const router = Router();
const controller = new JobApplicationController();

router.use(authenticate);

router.post('/', controller.apply);
router.get('/me', controller.getMyApplications);
router.get('/:id', controller.getApplicationById);
router.post('/:id/withdraw', controller.withdraw);

export default router;
