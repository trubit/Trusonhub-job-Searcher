import { Router } from 'express';
import { JobCategoryController } from '../controllers/job-category.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';
import { validate } from '../../../middleware/validate.js';
import { jobCategorySchema } from '../schemas/job-category.schema.js';

const router = Router();
const controller = new JobCategoryController();

router.get('/', controller.getCategories);

router.post('/', authenticate, authorize('ADMIN'), validate(jobCategorySchema), controller.createCategory);
router.put('/:id', authenticate, authorize('ADMIN'), validate(jobCategorySchema), controller.updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.deleteCategory);

export default router;
