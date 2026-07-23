import { Request, Response, NextFunction } from 'express';
import { JobApplication } from '../../../database/models/JobApplication.js';
import { Job } from '../../../database/models/Job.js';
import { Resume } from '../../../database/models/Resume.js';
import { User } from '../../../database/models/User.js';
import { AppError } from '../../../utils/AppError.js';
import { AuditLog } from '../../../database/models/AuditLog.js';
import { emailService } from '../../../emails/emailService.js';

export class ApplicationController {
  createApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicantId = req.user!._id.toString();
      const { jobId, resumeId, coverLetter } = req.body;

      if (!jobId || !resumeId) {
        throw new AppError('Job ID and Resume ID are required', 400);
      }

      // Check if job exists
      const job = await Job.findOne({ _id: jobId, isDeleted: false });
      if (!job) {
        throw new AppError('Job listing not found', 404);
      }

      // Check if resume exists and belongs to applicant
      const resume = await Resume.findOne({ _id: resumeId, user: applicantId, isDeleted: false });
      if (!resume) {
        throw new AppError('Selected resume profile not found or unauthorized', 404);
      }

      // Check duplicate application
      const existing = await JobApplication.findOne({ job: jobId, applicant: applicantId, isDeleted: false });
      if (existing) {
        throw new AppError('You have already applied to this job listing', 400);
      }

      const application = await JobApplication.create({
        job: jobId,
        applicant: applicantId,
        resume: resumeId,
        coverLetter,
        status: 'SUBMITTED',
      });

      // Increment application counter on job model
      await Job.findByIdAndUpdate(jobId, { $inc: { totalApplications: 1 } });

      await AuditLog.create({
        user: req.user!._id,
        action: 'JOB_APPLY',
        resource: `JobApplication:${application._id}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
        details: { jobId, resumeId },
      });

      // ── Send Application Confirmation Email ───────────────────────
      try {
        const applicant = await User.findById(applicantId).select('firstName email');
        if (applicant) {
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #3b82f6; margin-bottom: 8px;">Application Submitted! 🎉</h2>
              <p>Hi <strong>${applicant.firstName}</strong>,</p>
              <p>Your application for the position of <strong>${job.title}</strong> has been successfully submitted.</p>
              <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p style="margin: 0; font-size: 14px; color: #64748b;">Current Status: <strong style="color: #3b82f6;">SUBMITTED</strong></p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">You will be notified when your application status changes.</p>
              </div>
              <p style="color: #64748b; font-size: 14px;">Best of luck!<br/>The Talentra Team</p>
            </div>
          `;
          await emailService.sendEmail({
            to: applicant.email,
            subject: `Application Received: ${job.title} — Talentra`,
            html,
          });
        }
      } catch {
        // Email failure is non-critical — do not block the response
      }

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicantId = req.user!._id.toString();
      const list = await JobApplication.find({ applicant: applicantId, isDeleted: false })
        .populate({
          path: 'job',
          populate: { path: 'company', select: 'name logoUrl headquarters' },
        })
        .populate('resume', 'fileName fileUrl')
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  };

  getJobApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const userRole = req.user!.role;
      const { jobId } = req.params;

      const job = await Job.findById(jobId);
      if (!job || job.isDeleted) {
        throw new AppError('Job listing not found', 404);
      }

      // Check ownership
      if (job.employer.toString() !== employerId && userRole !== 'ADMIN') {
        throw new AppError('Unauthorized access to applications', 403);
      }

      const list = await JobApplication.find({ job: jobId, isDeleted: false })
        .populate('applicant', 'firstName lastName email phoneNumber')
        .populate('resume', 'fileName fileUrl fileSizeBytes')
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  };

  updateApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employerId = req.user!._id.toString();
      const userRole = req.user!.role;
      const { id } = req.params;
      const { status } = req.body;

      if (!['SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'].includes(status)) {
        throw new AppError('Invalid application status', 400);
      }

      const application = await JobApplication.findById(id).populate('job');
      if (!application || application.isDeleted) {
        throw new AppError('Job application not found', 404);
      }

      const job = application.job as unknown as { employer: { toString(): string }; title: string };
      if (job.employer.toString() !== employerId && userRole !== 'ADMIN') {
        throw new AppError('Unauthorized to update this application status', 403);
      }

      application.status = status;
      await application.save();

      await AuditLog.create({
        user: req.user!._id,
        action: 'JOB_APPLICATION_STATUS_UPDATE',
        resource: `JobApplication:${application._id}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
        details: { status, applicantId: application.applicant.toString() },
      });

      // ── Send Status Update Email to Applicant ──────────────────────
      try {
        const applicantUser = await User.findById(application.applicant).select('firstName email');
        if (applicantUser) {
          const statusColorMap: Record<string, string> = {
            SUBMITTED: '#3b82f6',
            REVIEWING: '#f59e0b',
            SHORTLISTED: '#8b5cf6',
            REJECTED: '#ef4444',
            ACCEPTED: '#10b981',
          };
          const statusColor = statusColorMap[status] || '#3b82f6';
          const statusMessages: Record<string, string> = {
            SUBMITTED: 'Your application has been received and is queued for review.',
            REVIEWING: 'Great news! An employer is actively reviewing your application.',
            SHORTLISTED: '🎉 Congratulations! You have been shortlisted for the next stage.',
            REJECTED: 'Unfortunately, you were not selected for this position. Keep applying!',
            ACCEPTED: '🎉 Amazing! Your application has been accepted. Expect to hear from the employer soon!',
          };
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #3b82f6;">Application Status Update</h2>
              <p>Hi <strong>${applicantUser.firstName}</strong>,</p>
              <p>Your application status for <strong>${job.title}</strong> has been updated:</p>
              <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: center;">
                <span style="display: inline-block; padding: 8px 20px; background: ${statusColor}; color: #fff; border-radius: 20px; font-weight: bold; font-size: 16px;">${status}</span>
                <p style="margin: 12px 0 0; font-size: 14px; color: #64748b;">${statusMessages[status] || ''}</p>
              </div>
              <p style="color: #64748b; font-size: 14px;">You can view your application status in your candidate dashboard.<br/>The Talentra Team</p>
            </div>
          `;
          await emailService.sendEmail({
            to: applicantUser.email,
            subject: `Application Update: ${status} — ${job.title} | Talentra`,
            html,
          });
        }
      } catch {
        // Email failure is non-critical
      }

      res.status(200).json({
        success: true,
        message: 'Application status updated successfully',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  };
}
