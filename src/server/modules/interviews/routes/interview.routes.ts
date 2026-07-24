import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';
import { validate } from '../../../middleware/validate.js';
import {
  scheduleInterviewSchema,
  updateInterviewSchema,
  cancelInterviewSchema,
  submitFeedbackSchema,
} from '../schemas/interview.schema.js';

const router = Router();
const controller = new InterviewController();

router.use(authenticate);

router.post('/', authorize('EMPLOYER', 'ADMIN'), validate(scheduleInterviewSchema), controller.scheduleInterview);
router.get('/my/all', controller.getMyInterviews);
router.get('/application/:applicationId', controller.getApplicationInterviews);
router.get('/:id', controller.getInterview);
router.put('/:id', authorize('EMPLOYER', 'ADMIN'), validate(updateInterviewSchema), controller.updateInterview);
router.patch('/:id/status', validate(cancelInterviewSchema), controller.updateStatus);

router.post('/:id/feedback', authorize('EMPLOYER', 'ADMIN'), validate(submitFeedbackSchema), controller.submitFeedback);
router.get('/:id/feedback', authorize('EMPLOYER', 'ADMIN'), controller.getFeedback);

export default router;
