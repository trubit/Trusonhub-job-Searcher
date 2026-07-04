import { Request, Response, NextFunction } from 'express';
import { User } from '../../../database/models/User.js';
import { Job } from '../../../database/models/Job.js';
import { JobCategory } from '../../../database/models/JobCategory.js';
import { SavedJob } from '../../../database/models/SavedJob.js';
import { AuditLog } from '../../../database/models/AuditLog.js';
import { AppError } from '../../../utils/AppError.js';

export class AdminController {
  getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const totalCandidates = await User.countDocuments({ role: 'JOB_SEEKER', isDeleted: false });
      const totalEmployers = await User.countDocuments({ role: 'EMPLOYER', isDeleted: false });
      const totalAdmins = await User.countDocuments({ role: 'ADMIN', isDeleted: false });
      const totalJobs = await Job.countDocuments({ isDeleted: false });
      const totalCategories = await JobCategory.countDocuments({ isDeleted: false });
      const totalSaves = await SavedJob.countDocuments({ isDeleted: false });

      res.status(200).json({
        success: true,
        data: {
          users: {
            candidates: totalCandidates,
            employers: totalEmployers,
            admins: totalAdmins,
            total: totalCandidates + totalEmployers + totalAdmins,
          },
          jobs: totalJobs,
          categories: totalCategories,
          savedBookmarks: totalSaves,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string;
      const query: Record<string, any> = { isDeleted: false };

      if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [
          { firstName: regex },
          { lastName: regex },
          { email: regex },
          { username: regex },
        ];
      }

      const users = await User.find(query).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  };

  updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'].includes(status)) {
        throw new AppError('Invalid status value', 400);
      }

      const user = await User.findByIdAndUpdate(id, { status }, { new: true });
      if (!user) throw new AppError('User not found', 404);

      await AuditLog.create({
        user: req.user!._id,
        action: 'ADMIN_UPDATE_USER_STATUS',
        resource: `User:${id}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
        details: { targetUserId: id, status },
      });

      res.status(200).json({ success: true, message: 'User status updated successfully', data: user });
    } catch (error) {
      next(error);
    }
  };

  updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['ADMIN', 'EMPLOYER', 'JOB_SEEKER'].includes(role)) {
        throw new AppError('Invalid role value', 400);
      }

      const targetUser = await User.findById(id);
      if (!targetUser) throw new AppError('User not found', 404);

      // Enforce strictly that only trustezika831@gmail.com is allowed to be ADMIN
      if (role === 'ADMIN' && targetUser.email.toLowerCase() !== 'trustezika831@gmail.com') {
        throw new AppError('Permission Denied: Only trustezika831@gmail.com can be assigned the ADMIN role', 403);
      }

      targetUser.role = role;
      await targetUser.save();

      await AuditLog.create({
        user: req.user!._id,
        action: 'ADMIN_UPDATE_USER_ROLE',
        resource: `User:${id}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
        details: { targetUserId: id, role },
      });

      res.status(200).json({ success: true, message: 'User role updated successfully', data: targetUser });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
      if (!user) throw new AppError('User not found', 404);

      await AuditLog.create({
        user: req.user!._id,
        action: 'ADMIN_DELETE_USER',
        resource: `User:${id}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
        details: { targetUserId: id },
      });

      res.status(200).json({ success: true, message: 'User soft-deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  getJobs = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobs = await Job.find({ isDeleted: false })
        .populate('company')
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const job = await Job.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
      if (!job) throw new AppError('Job not found', 404);

      await AuditLog.create({
        user: req.user!._id,
        action: 'ADMIN_DELETE_JOB',
        resource: `Job:${id}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
        details: { targetJobId: id, jobTitle: job.title },
      });

      res.status(200).json({ success: true, message: 'Job posting deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  getAuditLogs = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const logs = await AuditLog.find()
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(200);

      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  };
}
