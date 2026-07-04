import { Router } from 'express';
import { JobBookmarkController } from '../controllers/job-bookmark.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';

const router = Router();
const controller = new JobBookmarkController();

router.use(authenticate);

router.get('/bookmarks', controller.getBookmarks);
router.post('/jobs/:id/bookmark', controller.bookmarkJob);
router.delete('/jobs/:id/bookmark', controller.unbookmarkJob);

export default router;
