import { Request, Response, NextFunction } from 'express';
import { OfferService } from '../services/offer.service.js';

export class OfferController {
  private service = new OfferService();

  createOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const result = await this.service.createOffer(employerId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  sendOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const employerId = req.user!._id.toString();
      const result = await this.service.sendOffer(id, employerId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  acceptOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const candidateId = req.user!._id.toString();
      const result = await this.service.acceptOffer(id, candidateId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  declineOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const candidateId = req.user!._id.toString();
      const result = await this.service.declineOffer(id, candidateId, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  withdrawOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const employerId = req.user!._id.toString();
      const result = await this.service.withdrawOffer(id, employerId, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.service.getOfferById(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getMyOffers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const role = req.user!.role;
      const result =
        role === 'JOB_SEEKER'
          ? await this.service.getCandidateOffers(userId)
          : await this.service.getEmployerOffers(userId);

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getApplicationOffers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const result = await this.service.getApplicationOffers(applicationId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  updateOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.service.updateOffer(id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}
