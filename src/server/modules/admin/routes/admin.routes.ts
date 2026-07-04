import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorize } from '../../../middleware/authorize.js';

const router = Router();
const controller = new AdminController();

// Protect all admin endpoints with authentication and strict admin check
router.use(authenticate, authorize('ADMIN'));

router.get('/stats', controller.getStats);
router.get('/users', controller.getUsers);
router.put('/users/:id/status', controller.updateUserStatus);
router.put('/users/:id/role', controller.updateUserRole);
router.delete('/users/:id', controller.deleteUser);
router.get('/jobs', controller.getJobs);
router.delete('/jobs/:id', controller.deleteJob);
router.get('/audit-logs', controller.getAuditLogs);

export default router;
