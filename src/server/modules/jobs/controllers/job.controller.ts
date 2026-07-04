import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service.js';

export class JobController {
  private service = new JobService();

  createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const job = await this.service.createJob(employerId, req.body);
      res.status(201).json({ success: true, message: 'Job created successfully', data: job });
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const userRole = req.user!.role;
      const { id } = req.params;
      const job = await this.service.updateJob(id, employerId, userRole, req.body);
      res.status(200).json({ success: true, message: 'Job updated successfully', data: job });
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const userRole = req.user!.role;
      const { id } = req.params;
      await this.service.deleteJob(id, employerId, userRole);
      res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  getJobBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params;
      const userId = req.user?._id?.toString();
      const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'];
      
      const job = await this.service.getJobBySlug(slug, userId, ip, userAgent);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  };

  getEmployerJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const jobs = await this.service.getEmployerJobs(employerId);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  };

  getCompanyJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const jobs = await this.service.getCompanyJobs(id);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  };

  searchJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        keyword,
        location,
        category,
        employmentType,
        experienceLevel,
        remoteOption,
        minSalary,
        maxSalary,
        companyId,
        datePosted,
        sortBy,
        page,
        limit,
      } = req.query;

      const result = await this.service.searchJobs({
        keyword: keyword as string,
        location: location as string,
        category: category as string,
        employmentType: employmentType as string,
        experienceLevel: experienceLevel as string,
        remoteOption: remoteOption as string,
        minSalary: minSalary ? Number(minSalary) : undefined,
        maxSalary: maxSalary ? Number(maxSalary) : undefined,
        companyId: companyId as string,
        datePosted: datePosted as never,
        sortBy: sortBy as never,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  duplicateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const { id } = req.params;
      const duplicate = await this.service.duplicateJob(id, employerId);
      res.status(201).json({ success: true, message: 'Job duplicated successfully', data: duplicate });
    } catch (error) {
      next(error);
    }
  };
}
