import { JobType, IJobType } from '../../../database/models/JobType.js';

export class JobTypeRepository {
  async findAll(): Promise<IJobType[]> {
    return JobType.find({ isDeleted: false }).sort({ name: 1 });
  }

  async create(data: Partial<IJobType>): Promise<IJobType> {
    return JobType.create(data);
  }

  async delete(id: string): Promise<boolean> {
    const res = await JobType.updateOne({ _id: id }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }
}
