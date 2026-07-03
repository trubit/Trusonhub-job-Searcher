import { Router } from 'express';
import { ResumeController, upload } from '../controllers/resume.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';

const router = Router();
const controller = new ResumeController();

router.use(authenticate);

router.get('/', controller.getResumes);
router.post('/upload', upload.single('resume'), controller.uploadResume);
router.delete('/:id', controller.deleteResume);
router.put('/:id/primary', controller.setPrimary);

export default router;
