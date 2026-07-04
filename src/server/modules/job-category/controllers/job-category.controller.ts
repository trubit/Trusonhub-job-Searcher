import { Request, Response, NextFunction } from 'express';
import { JobCategoryService } from '../services/job-category.service.js';

export class JobCategoryController {
  private service = new JobCategoryService();

  getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.service.getCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.service.createCategory(req.body);
      res.status(201).json({ success: true, message: 'Category created successfully', data: category });
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.service.updateCategory(id, req.body);
      res.status(200).json({ success: true, message: 'Category updated successfully', data: category });
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.deleteCategory(id);
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
