import { JobTypeRepository } from '../repositories/job-type.repository.js';
import { IJobType } from '../../../database/models/JobType.js';
import { AppError } from '../../../utils/AppError.js';

export class JobTypeService {
  private repo = new JobTypeRepository();

  async getTypes(): Promise<IJobType[]> {
    return this.repo.findAll();
  }

  async createType(name: string): Promise<IJobType> {
    if (!name) throw new AppError('Job type name is required', 400);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.repo.create({ name, slug });
  }

  async deleteType(id: string): Promise<void> {
    const success = await this.repo.delete(id);
    if (!success) throw new AppError('Job type not found', 404);
  }
}
