import { JobRepository, JobSearchParams } from '../repositories/job.repository.js';
import { IJob } from '../../../database/models/Job.js';
import { Job } from '../../../database/models/Job.js';
import { JobView } from '../../../database/models/JobView.js';
import { AppError } from '../../../utils/AppError.js';
import crypto from 'node:crypto';

export class JobService {
  private repo = new JobRepository();

  private async generateUniqueSlug(title: string, city: string): Promise<string> {
    const base = `${title}-${city}`.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = base;
    let count = 0;
    while (await Job.findOne({ slug, isDeleted: false })) {
      count++;
      slug = `${base}-${count}`;
    }
    return slug;
  }

  async createJob(employerId: string, data: Partial<IJob>): Promise<IJob> {
    if (!data.title || !data.city) {
      throw new AppError('Job title and city are required', 400);
    }
    const slug = await this.generateUniqueSlug(data.title, data.city);
    return this.repo.create({ ...data, employer: employerId as never, slug });
  }

  async updateJob(id: string, employerId: string, userRole: string, data: Partial<IJob>): Promise<IJob> {
    if (data.title || data.city) {
      const current = await this.repo.findById(id);
      if (current) {
        const title = data.title || current.title;
        const city = data.city || current.city;
        data.slug = await this.generateUniqueSlug(title, city);
      }
    }

    const updated = userRole === 'ADMIN' 
      ? await this.repo.updateByAdmin(id, data)
      : await this.repo.update(id, employerId, data);
      
    if (!updated) throw new AppError('Job not found or unauthorized', 404);
    return updated;
  }

  async deleteJob(id: string, employerId: string, userRole: string): Promise<void> {
    const success = userRole === 'ADMIN'
      ? await this.repo.deleteByAdmin(id)
      : await this.repo.delete(id, employerId);
      
    if (!success) throw new AppError('Job not found or unauthorized', 404);
  }

  async getJobBySlug(slug: string, userId: string | undefined, ipAddress: string, userAgent?: string): Promise<IJob> {
    const job = await this.repo.findBySlug(slug);
    if (!job) throw new AppError('Job listing not found', 404);

    this.trackView(job._id.toString(), userId, ipAddress, userAgent).catch((err) => {
      console.error('Failed to track view:', err);
    });

    return job;
  }

  async getEmployerJobs(employerId: string): Promise<IJob[]> {
    return this.repo.findByEmployer(employerId);
  }

  async getCompanyJobs(companyId: string): Promise<IJob[]> {
    return this.repo.findByCompany(companyId);
  }

  async searchJobs(params: JobSearchParams) {
    return this.repo.search(params);
  }

  async duplicateJob(id: string, employerId: string): Promise<IJob> {
    const current = await this.repo.findById(id);
    if (!current || current.employer.toString() !== employerId) {
      throw new AppError('Job not found or unauthorized', 404);
    }

    const duplicateData = current.toObject();
    delete duplicateData._id;
    delete duplicateData.id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.totalViews;
    delete duplicateData.uniqueViews;
    delete duplicateData.totalSaves;
    
    duplicateData.title = `${duplicateData.title} (Copy)`;
    duplicateData.status = 'DRAFT';
    duplicateData.slug = await this.generateUniqueSlug(duplicateData.title, duplicateData.city);

    return this.repo.create(duplicateData);
  }

  async trackView(jobId: string, userId: string | undefined, ipAddress: string, userAgent?: string): Promise<void> {
    const ipHash = crypto.createHash('sha256').update(ipAddress || '127.0.0.1').digest('hex');
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const existingView = await JobView.findOne({
      job: jobId,
      ipHash,
      createdAt: { $gte: startOfToday }
    });

    if (!existingView) {
      await JobView.create({ job: jobId, user: userId as never, ipHash, userAgent });
      await Job.findByIdAndUpdate(jobId, { $inc: { totalViews: 1, uniqueViews: 1 } });
    } else {
      await Job.findByIdAndUpdate(jobId, { $inc: { totalViews: 1 } });
    }
  }
}
