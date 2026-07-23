import { Router } from 'express';
import { AtsController } from '../controllers/ats.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';

const router = Router();
const controller = new AtsController();

router.use(authenticate, authorize('EMPLOYER', 'ADMIN'));

router.get('/metrics', controller.getMetrics);
router.get('/', controller.getApplications);
router.get('/:id', controller.getApplicationById);
router.patch('/:id/status', controller.updateStatus);
router.patch('/:id/rating', controller.updateRating);
router.patch('/:id/flag', controller.toggleFlag);
router.get('/:id/notes', controller.getNotes);
router.post('/:id/notes', controller.addNote);
router.delete('/:id/notes/:noteId', controller.deleteNote);
router.post('/bulk-update', controller.bulkUpdate);

export default router;
