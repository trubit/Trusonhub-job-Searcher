import { JobLocationRepository } from '../repositories/job-location.repository.js';
import { IJobLocation } from '../../../database/models/JobLocation.js';
import { AppError } from '../../../utils/AppError.js';

export class JobLocationService {
  private repo = new JobLocationRepository();

  async getLocations(): Promise<IJobLocation[]> {
    return this.repo.findAll();
  }

  async createLocation(name: string): Promise<IJobLocation> {
    if (!name) throw new AppError('Location name is required', 400);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.repo.create({ name, slug });
  }

  async deleteLocation(id: string): Promise<void> {
    const success = await this.repo.delete(id);
    if (!success) throw new AppError('Location not found', 404);
  }
}
