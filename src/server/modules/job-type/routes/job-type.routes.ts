import { Router } from 'express';
import { JobTypeController } from '../controllers/job-type.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';

const router = Router();
const controller = new JobTypeController();

router.get('/', controller.getTypes);
router.post('/', authenticate, authorize('ADMIN'), controller.createType);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.deleteType);

export default router;
