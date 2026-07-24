import { Router } from 'express';
import { HiringController } from '../controllers/hiring.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';
import { validate } from '../../../middleware/validate.js';
import { makeDecisionSchema } from '../schemas/hiring.schema.js';

const router = Router();
const controller = new HiringController();

router.use(authenticate);

router.post('/decisions', authorize('EMPLOYER', 'ADMIN'), validate(makeDecisionSchema), controller.makeDecision);
router.get('/decisions/application/:applicationId', authorize('EMPLOYER', 'ADMIN'), controller.getApplicationDecisions);

export default router;
