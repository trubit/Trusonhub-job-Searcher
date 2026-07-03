import { Router } from 'express';
import { MediaController, uploadMediaMiddleware } from '../controllers/media.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';

const router = Router();
const controller = new MediaController();

router.use(authenticate);

router.post('/upload', uploadMediaMiddleware.single('file'), controller.uploadImage);
router.delete('/:id', controller.deleteMedia);

export default router;
