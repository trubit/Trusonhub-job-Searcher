import { Job, IJob } from '../../../database/models/Job.js';
import { Types, FilterQuery } from 'mongoose';

export interface JobSearchParams {
  keyword?: string;
  location?: string;
  category?: string;
  employmentType?: string;
  experienceLevel?: string;
  remoteOption?: string;
  minSalary?: number;
  maxSalary?: number;
  companyId?: string;
  datePosted?: '24h' | '3d' | '7d' | '30d' | 'all';
  sortBy?: 'recent' | 'views' | 'salary_desc' | 'salary_asc';
  page?: number;
  limit?: number;
}

export class JobRepository {
  async create(data: Partial<IJob>): Promise<IJob> {
    return Job.create(data);
  }

  async findById(id: string): Promise<IJob | null> {
    return Job.findOne({ _id: id, isDeleted: false }).populate('company').populate({ path: 'employer', select: 'firstName lastName email avatarUrl' });
  }

  async findBySlug(slug: string): Promise<IJob | null> {
    return Job.findOne({ slug, isDeleted: false }).populate('company').populate({ path: 'employer', select: 'firstName lastName email avatarUrl' });
  }

  async findByEmployer(employerId: string): Promise<IJob[]> {
    return Job.find({ employer: employerId, isDeleted: false }).populate('company').sort({ createdAt: -1 });
  }

  async findByCompany(companyId: string, statuses: string[] = ['PUBLISHED']): Promise<IJob[]> {
    return Job.find({ company: companyId, status: { $in: statuses }, isDeleted: false }).populate('company').sort({ createdAt: -1 });
  }

  async update(id: string, employerId: string, data: Partial<IJob>): Promise<IJob | null> {
    return Job.findOneAndUpdate({ _id: id, employer: employerId, isDeleted: false }, data, { new: true });
  }

  async updateByAdmin(id: string, data: Partial<IJob>): Promise<IJob | null> {
    return Job.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  }

  async delete(id: string, employerId: string): Promise<boolean> {
    const res = await Job.updateOne({ _id: id, employer: employerId }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }

  async deleteByAdmin(id: string): Promise<boolean> {
    const res = await Job.updateOne({ _id: id }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }

  async search(params: JobSearchParams): Promise<{ jobs: IJob[]; total: number; page: number; pages: number }> {
    const query: FilterQuery<IJob> = { isDeleted: false };

    if (!params.companyId) {
      query.status = 'PUBLISHED';
      query.visibility = 'PUBLIC';
    }

    if (params.companyId) {
      query.company = new Types.ObjectId(params.companyId);
    }

    if (params.keyword) {
      const keywordRegex = new RegExp(params.keyword, 'i');
      query.$or = [
        { title: keywordRegex },
        { description: keywordRegex },
        { requiredSkills: keywordRegex },
        { tags: keywordRegex },
      ];
    }

    if (params.location) {
      const locationRegex = new RegExp(params.location, 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { country: locationRegex },
          { state: locationRegex },
          { city: locationRegex },
        ]
      });
    }

    if (params.category) {
      query.category = params.category;
    }

    if (params.employmentType) {
      query.employmentType = params.employmentType;
    }

    if (params.experienceLevel) {
      query.experienceLevel = params.experienceLevel;
    }

    if (params.remoteOption) {
      query.remoteOption = params.remoteOption;
    }

    if (params.minSalary !== undefined || params.maxSalary !== undefined) {
      query.$and = query.$and || [];
      if (params.minSalary !== undefined) {
        query.$and.push({
          $or: [
            { minimumSalary: { $gte: params.minSalary } },
            { maximumSalary: { $gte: params.minSalary } },
            { salaryType: 'NEGOTIABLE' }
          ]
        });
      }
      if (params.maxSalary !== undefined) {
        query.$and.push({
          $or: [
            { minimumSalary: { $lte: params.maxSalary } },
            { maximumSalary: { $lte: params.maxSalary } },
            { salaryType: 'NEGOTIABLE' }
          ]
        });
      }
    }

    if (params.datePosted && params.datePosted !== 'all') {
      const dateLimit = new Date();
      if (params.datePosted === '24h') dateLimit.setHours(dateLimit.getHours() - 24);
      else if (params.datePosted === '3d') dateLimit.setDate(dateLimit.getDate() - 3);
      else if (params.datePosted === '7d') dateLimit.setDate(dateLimit.getDate() - 7);
      else if (params.datePosted === '30d') dateLimit.setDate(dateLimit.getDate() - 30);
      query.createdAt = { $gte: dateLimit };
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));
    const skip = (page - 1) * limit;

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (params.sortBy === 'views') {
      sort = { totalViews: -1, createdAt: -1 };
    } else if (params.sortBy === 'salary_desc') {
      sort = { maximumSalary: -1, createdAt: -1 };
    } else if (params.sortBy === 'salary_asc') {
      sort = { minimumSalary: 1, createdAt: -1 };
    } else if (params.sortBy === 'recent') {
      sort = { createdAt: -1 };
    }

    const [jobs, total] = await Promise.all([
      Job.find(query).populate('company').sort(sort).skip(skip).limit(limit),
      Job.countDocuments(query),
    ]);

    return {
      jobs,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}
