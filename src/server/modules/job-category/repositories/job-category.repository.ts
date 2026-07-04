import { JobCategory, IJobCategory } from '../../../database/models/JobCategory.js';

export class JobCategoryRepository {
  async findAll(): Promise<IJobCategory[]> {
    return JobCategory.find({ isDeleted: false }).sort({ name: 1 });
  }

  async findById(id: string): Promise<IJobCategory | null> {
    return JobCategory.findOne({ _id: id, isDeleted: false });
  }

  async create(data: Partial<IJobCategory>): Promise<IJobCategory> {
    return JobCategory.create(data);
  }

  async update(id: string, data: Partial<IJobCategory>): Promise<IJobCategory | null> {
    return JobCategory.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const res = await JobCategory.updateOne({ _id: id }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }
}
