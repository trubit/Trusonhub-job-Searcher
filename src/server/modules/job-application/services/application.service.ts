import { JobApplicationRepository } from '../repositories/application.repository.js';
import { IJobApplication } from '../../../database/models/JobApplication.js';
import { Job } from '../../../database/models/Job.js';
import { ApplicationActivity } from '../../../database/models/ApplicationActivity.js';
import { ApplicationHistory } from '../../../database/models/ApplicationHistory.js';
import { AppError } from '../../../utils/AppError.js';
import { emailService } from '../../../emails/emailService.js';
import { CreateApplicationDTO, WithdrawApplicationDTO } from '../schemas/application.schema.js';

export class JobApplicationService {
  private repo = new JobApplicationRepository();

  async applyToJob(applicantId: string, dto: CreateApplicationDTO): Promise<IJobApplication> {
    const job = await Job.findOne({ _id: dto.jobId, isDeleted: false });
    if (!job) {
      throw new AppError('Job listing not found or has been removed', 404);
    }

    if (job.status !== 'PUBLISHED') {
      throw new AppError('This job is no longer accepting applications', 400);
    }

    if (job.applicationDeadline && new Date() > new Date(job.applicationDeadline)) {
      throw new AppError('Application deadline for this position has passed', 400);
    }

    // Check duplicate application
    const existing = await this.repo.findByJobAndApplicant(dto.jobId, applicantId);
    if (existing) {
      if (!existing.isDraft) {
        throw new AppError('You have already applied for this job position', 409);
      }
      // Update draft
      const updated = await this.repo.update(existing._id.toString(), applicantId, {
        coverLetter: dto.coverLetter,
        resume: dto.resumeId as never,
        resumeUrl: dto.resumeUrl,
        isDraft: dto.isDraft ?? false,
        status: dto.isDraft ? 'DRAFT' : 'SUBMITTED',
        submittedAt: dto.isDraft ? undefined : new Date(),
      });
      return updated!;
    }

    const application = await this.repo.create({
      job: dto.jobId as never,
      applicant: applicantId as never,
      employer: job.employer,
      company: job.company,
      resume: dto.resumeId as never,
      resumeUrl: dto.resumeUrl,
      coverLetter: dto.coverLetter,
      status: dto.isDraft ? 'DRAFT' : 'SUBMITTED',
      isDraft: dto.isDraft ?? false,
      submittedAt: dto.isDraft ? undefined : new Date(),
    });

    // Create activity & history
    await ApplicationActivity.create({
      application: application._id,
      actor: applicantId as never,
      activityType: 'SUBMITTED',
      description: dto.isDraft ? 'Saved application draft' : 'Submitted job application',
    });

    if (!dto.isDraft) {
      await ApplicationHistory.create({
        application: application._id,
        newStatus: 'SUBMITTED',
        action: 'Application Submitted',
        performedBy: applicantId as never,
      });

      // Send email asynchronously
      emailService.sendEmail({
        to: (applicantId as unknown as { email: string }).email || 'applicant@talentra.com',
        subject: `Application Received: ${job.title} — Talentra`,
        html: `<p>Your application for <strong>${job.title}</strong> has been successfully submitted!</p>`,
      }).catch(() => {});
    }

    return application;
  }

  async getMyApplications(applicantId: string): Promise<IJobApplication[]> {
    return this.repo.findByApplicant(applicantId);
  }

  async getApplicationById(id: string, applicantId: string): Promise<IJobApplication> {
    const application = await this.repo.findById(id);
    if (!application || application.applicant._id.toString() !== applicantId) {
      throw new AppError('Application not found', 404);
    }
    return application;
  }

  async withdrawApplication(id: string, applicantId: string, dto: WithdrawApplicationDTO): Promise<IJobApplication> {
    const application = await this.repo.findById(id);
    if (!application || application.applicant._id.toString() !== applicantId) {
      throw new AppError('Application not found', 404);
    }

    if (application.status === 'WITHDRAWN') {
      throw new AppError('Application is already withdrawn', 400);
    }

    const previousStatus = application.status;
    application.status = 'WITHDRAWN';
    application.withdrawnAt = new Date();
    await application.save();

    await ApplicationHistory.create({
      application: application._id,
      previousStatus,
      newStatus: 'WITHDRAWN',
      action: 'Application Withdrawn by Candidate',
      performedBy: applicantId as never,
      reason: dto.reason,
    });

    await ApplicationActivity.create({
      application: application._id,
      actor: applicantId as never,
      activityType: 'WITHDRAWN',
      description: `Withdrew application. Reason: ${dto.reason || 'Not specified'}`,
    });

    return application;
  }
}
