import { AtsRepository, AtsFilterParams } from '../repositories/ats.repository.js';
import { IJobApplication, JobApplication } from '../../../database/models/JobApplication.js';
import { ApplicationHistory } from '../../../database/models/ApplicationHistory.js';
import { ApplicationActivity } from '../../../database/models/ApplicationActivity.js';
import { ApplicationNotes, IApplicationNotes } from '../../../database/models/ApplicationNotes.js';
import { AppError } from '../../../utils/AppError.js';
import { emailService } from '../../../emails/emailService.js';
import {
  UpdateStatusDTO,
  UpdateRatingDTO,
  ToggleFlagDTO,
  CreateNoteDTO,
  BulkUpdateDTO,
} from '../schemas/ats.schema.js';

export class AtsService {
  private repo = new AtsRepository();

  async getEmployerMetrics(employerId: string, jobId?: string): Promise<Record<string, number>> {
    return this.repo.getEmployerMetrics(employerId, jobId);
  }

  async getApplications(params: AtsFilterParams) {
    return this.repo.getApplications(params);
  }

  async getApplicationById(id: string, employerId: string): Promise<IJobApplication> {
    const application = await this.repo.findByIdAndEmployer(id, employerId);
    if (!application) {
      throw new AppError('Application not found or unauthorized', 404);
    }
    return application;
  }

  async updateStatus(id: string, employerId: string, dto: UpdateStatusDTO): Promise<IJobApplication> {
    const application = await this.repo.findByIdAndEmployer(id, employerId);
    if (!application) {
      throw new AppError('Application not found or unauthorized', 404);
    }

    const previousStatus = application.status;
    application.status = dto.status;
    await application.save();

    // Log History
    await ApplicationHistory.create({
      application: application._id,
      previousStatus,
      newStatus: dto.status,
      action: `Status changed to ${dto.status}`,
      performedBy: employerId as never,
      reason: dto.reason,
    });

    // Log Activity
    await ApplicationActivity.create({
      application: application._id,
      actor: employerId as never,
      activityType: 'STATUS_CHANGED',
      description: `Moved stage from ${previousStatus} to ${dto.status}`,
    });

    // Send candidate email alert
    const applicant = application.applicant as unknown as { email: string; firstName: string };
    const job = application.job as unknown as { title: string };
    if (applicant && applicant.email) {
      emailService.sendEmail({
        to: applicant.email,
        subject: `Application Update: ${dto.status} — ${job?.title || 'Position'} | Talentra`,
        html: `<p>Hi ${applicant.firstName || 'Candidate'},</p><p>Your application status has been updated to <strong>${dto.status}</strong>.</p>`,
      }).catch(() => {});
    }

    return application;
  }

  async updateRating(id: string, employerId: string, dto: UpdateRatingDTO): Promise<IJobApplication> {
    const application = await this.repo.findByIdAndEmployer(id, employerId);
    if (!application) {
      throw new AppError('Application not found or unauthorized', 404);
    }

    application.rating = dto.rating;
    await application.save();

    await ApplicationActivity.create({
      application: application._id,
      actor: employerId as never,
      activityType: 'RATED',
      description: `Rated candidate ${dto.rating} stars`,
    });

    return application;
  }

  async toggleFlag(id: string, employerId: string, dto: ToggleFlagDTO): Promise<IJobApplication> {
    const application = await this.repo.findByIdAndEmployer(id, employerId);
    if (!application) {
      throw new AppError('Application not found or unauthorized', 404);
    }

    application.flagged = dto.flagged;
    await application.save();

    await ApplicationActivity.create({
      application: application._id,
      actor: employerId as never,
      activityType: dto.flagged ? 'FLAGGED' : 'UNFLAGGED',
      description: dto.flagged ? 'Flagged application for review' : 'Unflagged application',
    });

    return application;
  }

  async getNotes(applicationId: string, employerId: string): Promise<IApplicationNotes[]> {
    await this.getApplicationById(applicationId, employerId);
    return ApplicationNotes.find({ application: applicationId }).populate('author', 'firstName lastName avatarUrl').sort({ isPinned: -1, createdAt: -1 });
  }

  async addNote(applicationId: string, employerId: string, dto: CreateNoteDTO): Promise<IApplicationNotes> {
    await this.getApplicationById(applicationId, employerId);

    const note = await ApplicationNotes.create({
      application: applicationId as never,
      author: employerId as never,
      content: dto.content,
      isPinned: dto.isPinned ?? false,
    });

    // Update count
    await JobApplication.updateOne({ _id: applicationId }, { $inc: { notesCount: 1 } });

    await ApplicationActivity.create({
      application: applicationId as never,
      actor: employerId as never,
      activityType: 'NOTE_ADDED',
      description: 'Added internal evaluation note',
    });

    return note;
  }

  async deleteNote(noteId: string, applicationId: string, employerId: string): Promise<void> {
    await this.getApplicationById(applicationId, employerId);
    const deleted = await ApplicationNotes.findOneAndDelete({ _id: noteId, application: applicationId });
    if (deleted) {
      await JobApplication.updateOne({ _id: applicationId }, { $inc: { notesCount: -1 } });
    }
  }

  async bulkUpdate(employerId: string, dto: BulkUpdateDTO): Promise<{ updatedCount: number }> {
    let targetStatus = dto.status;
    if (dto.action === 'SHORTLIST') targetStatus = 'SHORTLISTED';
    else if (dto.action === 'REJECT') targetStatus = 'REJECTED';
    else if (dto.action === 'ARCHIVE') targetStatus = 'WITHDRAWN';

    if (!targetStatus) {
      throw new AppError('Target status is required for bulk action', 400);
    }

    const result = await JobApplication.updateMany(
      { _id: { $in: dto.applicationIds }, employer: employerId, isDeleted: false },
      { $set: { status: targetStatus } }
    );

    // Create history logs
    for (const appId of dto.applicationIds) {
      await ApplicationHistory.create({
        application: appId as never,
        newStatus: targetStatus,
        action: `Bulk action: ${dto.action}`,
        performedBy: employerId as never,
      }).catch(() => {});
    }

    return { updatedCount: result.modifiedCount };
  }
}
