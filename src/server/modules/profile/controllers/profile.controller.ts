import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service.js';

export class ProfileController {
  private service = new ProfileService();

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const profile = await this.service.getProfile(userId);
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const updated = await this.service.updateProfile(userId, req.body);
      res.status(200).json({ success: true, message: 'Profile updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  };

  deletePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const result = await this.service.deleteProfilePhoto(userId);
      res.status(200).json({ success: true, message: 'Profile photo removed', data: result });
    } catch (error) {
      next(error);
    }
  };

  getPublicProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username } = req.params;
      const profile = await this.service.getPublicProfileByUsername(username);
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };

  // Education Handlers
  addEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const result = await this.service.addEducation(userId, req.body);
      res.status(201).json({ success: true, message: 'Education added', data: result });
    } catch (error) {
      next(error);
    }
  };

  updateEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.updateEducation(id, userId, req.body);
      res.status(200).json({ success: true, message: 'Education updated', data: result });
    } catch (error) {
      next(error);
    }
  };

  deleteEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.deleteEducation(id, userId);
      res.status(200).json({ success: true, message: 'Education deleted', data: result });
    } catch (error) {
      next(error);
    }
  };

  // Experience Handlers
  addExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const result = await this.service.addExperience(userId, req.body);
      res.status(201).json({ success: true, message: 'Experience added', data: result });
    } catch (error) {
      next(error);
    }
  };

  updateExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.updateExperience(id, userId, req.body);
      res.status(200).json({ success: true, message: 'Experience updated', data: result });
    } catch (error) {
      next(error);
    }
  };

  deleteExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.deleteExperience(id, userId);
      res.status(200).json({ success: true, message: 'Experience deleted', data: result });
    } catch (error) {
      next(error);
    }
  };

  // Skill Handlers
  addSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const result = await this.service.addSkill(userId, req.body);
      res.status(201).json({ success: true, message: 'Skill added', data: result });
    } catch (error) {
      next(error);
    }
  };

  updateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.updateSkill(id, userId, req.body);
      res.status(200).json({ success: true, message: 'Skill updated', data: result });
    } catch (error) {
      next(error);
    }
  };

  deleteSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.deleteSkill(id, userId);
      res.status(200).json({ success: true, message: 'Skill deleted', data: result });
    } catch (error) {
      next(error);
    }
  };

  // Certification Handlers
  addCertification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const result = await this.service.addCertification(userId, req.body);
      res.status(201).json({ success: true, message: 'Certification added', data: result });
    } catch (error) {
      next(error);
    }
  };

  updateCertification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.updateCertification(id, userId, req.body);
      res.status(200).json({ success: true, message: 'Certification updated', data: result });
    } catch (error) {
      next(error);
    }
  };

  deleteCertification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.deleteCertification(id, userId);
      res.status(200).json({ success: true, message: 'Certification deleted', data: result });
    } catch (error) {
      next(error);
    }
  };

  // Language Handlers
  addLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const result = await this.service.addLanguage(userId, req.body);
      res.status(201).json({ success: true, message: 'Language added', data: result });
    } catch (error) {
      next(error);
    }
  };

  updateLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.updateLanguage(id, userId, req.body);
      res.status(200).json({ success: true, message: 'Language updated', data: result });
    } catch (error) {
      next(error);
    }
  };

  deleteLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.deleteLanguage(id, userId);
      res.status(200).json({ success: true, message: 'Language deleted', data: result });
    } catch (error) {
      next(error);
    }
  };

  // Portfolio Handlers
  addPortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const result = await this.service.addPortfolio(userId, req.body);
      res.status(201).json({ success: true, message: 'Portfolio item added', data: result });
    } catch (error) {
      next(error);
    }
  };

  updatePortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.updatePortfolio(id, userId, req.body);
      res.status(200).json({ success: true, message: 'Portfolio item updated', data: result });
    } catch (error) {
      next(error);
    }
  };

  deletePortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await this.service.deletePortfolio(id, userId);
      res.status(200).json({ success: true, message: 'Portfolio item deleted', data: result });
    } catch (error) {
      next(error);
    }
  };
}
