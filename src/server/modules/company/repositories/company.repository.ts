import { Types } from 'mongoose';
import { Company, ICompany } from '../../../database/models/Company.js';

export class CompanyRepository {
  async createCompany(data: Partial<ICompany>): Promise<ICompany> {
    return Company.create(data);
  }

  async findById(id: string): Promise<ICompany | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return Company.findOne({ _id: id, isDeleted: false });
  }

  async findBySlug(slug: string): Promise<ICompany | null> {
    return Company.findOne({ slug: slug.toLowerCase(), isDeleted: false });
  }

  async findByOwner(ownerId: string): Promise<ICompany[]> {
    return Company.find({ owner: ownerId, isDeleted: false }).sort({ createdAt: -1 });
  }

  async updateCompany(id: string, ownerId: string, data: Partial<ICompany>): Promise<ICompany | null> {
    return Company.findOneAndUpdate({ _id: id, owner: ownerId, isDeleted: false }, data, { new: true });
  }

  async deleteCompany(id: string, ownerId: string): Promise<boolean> {
    const res = await Company.updateOne({ _id: id, owner: ownerId }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }

  async findAll(): Promise<ICompany[]> {
    return Company.find({ isDeleted: false }).sort({ createdAt: -1 });
  }
}
