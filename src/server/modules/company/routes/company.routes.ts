import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';
import { validate } from '../../../middleware/validate.js';
import { companySchema } from '../schemas/company.schema.js';

const router = Router();
const controller = new CompanyController();

// ── Authenticated Specific Routes (must precede dynamic /:id route) ─────────
router.get('/my/all', authenticate, authorize('EMPLOYER', 'ADMIN'), controller.getMyCompanies);
router.get('/', controller.getAllCompanies);

// ── Public Company Profile Route ─────────────────────────────────────────────
router.get('/:id', controller.getCompany);

// ── Authenticated Mutation Routes ────────────────────────────────────────────
router.post('/', authenticate, authorize('EMPLOYER', 'ADMIN'), validate(companySchema), controller.createCompany);
router.put('/:id', authenticate, authorize('EMPLOYER', 'ADMIN'), validate(companySchema), controller.updateCompany);
router.delete('/:id', authenticate, authorize('EMPLOYER', 'ADMIN'), controller.deleteCompany);

export default router;
