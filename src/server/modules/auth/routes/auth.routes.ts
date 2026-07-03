import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../../../middleware/validate.js';
import { authenticate } from '../../../middleware/authenticate.js';
import {
  registerJobSeekerSchema,
  registerEmployerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../schemas/auth.schema.js';

const router = Router();
const controller = new AuthController();

// ── Public Routes ────────────────────────────────────────────────────────────
router.post('/register/job-seeker', validate(registerJobSeekerSchema), controller.registerJobSeeker);
router.post('/register/employer', validate(registerEmployerSchema), controller.registerEmployer);
router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/verify-email', validate(verifyEmailSchema), controller.verifyEmail);
router.post('/resend-verification', validate(resendVerificationSchema), controller.resendVerification);
router.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword);

// ── Authenticated Protected Routes ─────────────────────────────────────────
router.use(authenticate);

router.get('/me', controller.me);
router.post('/logout', controller.logout);
router.post('/change-password', validate(changePasswordSchema), controller.changePassword);
router.get('/sessions', controller.getSessions);
router.delete('/sessions/:id', controller.revokeSession);
router.delete('/logout-all', controller.logoutAll);

export default router;
