import { JobCategoryRepository } from '../repositories/job-category.repository.js';
import { IJobCategory } from '../../../database/models/JobCategory.js';
import { AppError } from '../../../utils/AppError.js';

export class JobCategoryService {
  private repo = new JobCategoryRepository();

  async getCategories(): Promise<IJobCategory[]> {
    return this.repo.findAll();
  }

  async createCategory(data: Partial<IJobCategory>): Promise<IJobCategory> {
    if (!data.name) throw new AppError('Category name is required', 400);
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.repo.create({ ...data, slug });
  }

  async updateCategory(id: string, data: Partial<IJobCategory>): Promise<IJobCategory> {
    const updated = await this.repo.update(id, data);
    if (!updated) throw new AppError('Category not found', 404);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const success = await this.repo.delete(id);
    if (!success) throw new AppError('Category not found', 404);
  }
}
