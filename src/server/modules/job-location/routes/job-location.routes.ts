import { Router } from 'express';
import { JobLocationController } from '../controllers/job-location.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';

const router = Router();
const controller = new JobLocationController();

router.get('/', controller.getLocations);
router.post('/', authenticate, authorize('ADMIN'), controller.createLocation);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.deleteLocation);

export default router;
