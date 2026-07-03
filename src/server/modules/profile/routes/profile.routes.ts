import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { authenticate } from '../../../middleware/authenticate.js';
import { validate } from '../../../middleware/validate.js';
import {
  updateProfileSchema,
  educationSchema,
  experienceSchema,
  skillSchema,
  certificationSchema,
  languageSchema,
  portfolioSchema,
} from '../schemas/profile.schema.js';

const router = Router();
const controller = new ProfileController();

// ── Public Candidate Profile ─────────────────────────────────────────────────
router.get('/public/:username', controller.getPublicProfile);

// ── Authenticated Profile Routes ─────────────────────────────────────────────
router.use(authenticate);

router.get('/', controller.getProfile);
router.put('/', validate(updateProfileSchema), controller.updateProfile);
router.delete('/photo', controller.deletePhoto);

// Education
router.post('/education', validate(educationSchema), controller.addEducation);
router.put('/education/:id', validate(educationSchema), controller.updateEducation);
router.delete('/education/:id', controller.deleteEducation);

// Experience
router.post('/experience', validate(experienceSchema), controller.addExperience);
router.put('/experience/:id', validate(experienceSchema), controller.updateExperience);
router.delete('/experience/:id', controller.deleteExperience);

// Skills
router.post('/skills', validate(skillSchema), controller.addSkill);
router.put('/skills/:id', validate(skillSchema), controller.updateSkill);
router.delete('/skills/:id', controller.deleteSkill);

// Certifications
router.post('/certifications', validate(certificationSchema), controller.addCertification);
router.put('/certifications/:id', validate(certificationSchema), controller.updateCertification);
router.delete('/certifications/:id', controller.deleteCertification);

// Languages
router.post('/languages', validate(languageSchema), controller.addLanguage);
router.put('/languages/:id', validate(languageSchema), controller.updateLanguage);
router.delete('/languages/:id', controller.deleteLanguage);

// Portfolio
router.post('/portfolio', validate(portfolioSchema), controller.addPortfolio);
router.put('/portfolio/:id', validate(portfolioSchema), controller.updatePortfolio);
router.delete('/portfolio/:id', controller.deletePortfolio);

export default router;
