import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../services/company.service.js';

export class CompanyController {
  private service = new CompanyService();

  createCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.user!._id.toString();
      const company = await this.service.createCompany(ownerId, req.body);
      res.status(201).json({ success: true, message: 'Company created successfully', data: company });
    } catch (error) {
      next(error);
    }
  };

  getMyCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.user!._id.toString();
      const companies = await this.service.getMyCompanies(ownerId);
      res.status(200).json({ success: true, data: companies });
    } catch (error) {
      next(error);
    }
  };

  getCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const company = await this.service.getCompanyByIdOrSlug(id);
      res.status(200).json({ success: true, data: company });
    } catch (error) {
      next(error);
    }
  };

  updateCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.user!._id.toString();
      const { id } = req.params;
      const updated = await this.service.updateCompany(id, ownerId, req.body);
      res.status(200).json({ success: true, message: 'Company updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  };

  deleteCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.user!._id.toString();
      const { id } = req.params;
      await this.service.deleteCompany(id, ownerId);
      res.status(200).json({ success: true, message: 'Company deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
