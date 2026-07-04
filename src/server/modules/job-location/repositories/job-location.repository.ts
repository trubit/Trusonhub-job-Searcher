import { JobLocation, IJobLocation } from '../../../database/models/JobLocation.js';

export class JobLocationRepository {
  async findAll(): Promise<IJobLocation[]> {
    return JobLocation.find({ isDeleted: false }).sort({ name: 1 });
  }

  async create(data: Partial<IJobLocation>): Promise<IJobLocation> {
    return JobLocation.create(data);
  }

  async delete(id: string): Promise<boolean> {
    const res = await JobLocation.updateOne({ _id: id }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }
}
