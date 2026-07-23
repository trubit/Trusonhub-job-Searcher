import { JobApplication, IJobApplication } from '../../../database/models/JobApplication.js';
import { FilterQuery, Types } from 'mongoose';

export interface AtsFilterParams {
  employerId: string;
  jobId?: string;
  status?: string;
  experienceLevel?: string;
  location?: string;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date_desc' | 'date_asc' | 'rating_desc' | 'name_asc';
}

export class AtsRepository {
  async getEmployerMetrics(employerId: string, jobId?: string): Promise<Record<string, number>> {
    const match: FilterQuery<IJobApplication> = {
      employer: new Types.ObjectId(employerId),
      isDeleted: false,
    };

    if (jobId) {
      match.job = new Types.ObjectId(jobId);
    }

    const counts = await JobApplication.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const metrics: Record<string, number> = {
      total: 0,
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      SHORTLISTED: 0,
      INTERVIEW_SCHEDULED: 0,
      INTERVIEW_COMPLETED: 0,
      ASSESSMENT_PENDING: 0,
      OFFER_EXTENDED: 0,
      OFFER_ACCEPTED: 0,
      OFFER_DECLINED: 0,
      HIRED: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };

    for (const item of counts) {
      metrics[item._id] = item.count;
      metrics.total += item.count;
    }

    return metrics;
  }

  async getApplications(params: AtsFilterParams): Promise<{ applications: IJobApplication[]; total: number; page: number; pages: number }> {
    const query: FilterQuery<IJobApplication> = {
      employer: new Types.ObjectId(params.employerId),
      isDeleted: false,
    };

    if (params.jobId) {
      query.job = new Types.ObjectId(params.jobId);
    }

    if (params.status) {
      query.status = params.status;
    }

    if (params.minRating !== undefined && params.minRating > 0) {
      query.rating = { $gte: params.minRating };
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 15));
    const skip = (page - 1) * limit;

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (params.sortBy === 'date_asc') sort = { createdAt: 1 };
    else if (params.sortBy === 'rating_desc') sort = { rating: -1, createdAt: -1 };

    const [applications, total] = await Promise.all([
      JobApplication.find(query)
        .populate('job')
        .populate({ path: 'applicant', select: 'firstName lastName email avatarUrl phone location headline' })
        .populate('company')
        .populate('resume')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      JobApplication.countDocuments(query),
    ]);

    return {
      applications,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findByIdAndEmployer(id: string, employerId: string): Promise<IJobApplication | null> {
    return JobApplication.findOne({
      _id: id,
      employer: employerId,
      isDeleted: false,
    })
      .populate('job')
      .populate({ path: 'applicant', select: 'firstName lastName email avatarUrl phone location headline' })
      .populate('company')
      .populate('resume');
  }
}
