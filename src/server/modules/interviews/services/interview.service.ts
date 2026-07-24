import { InterviewRepository } from '../repositories/interview.repository.js';
import { JobApplication } from '../../../database/models/JobApplication.js';
import { AppError } from '../../../utils/AppError.js';
import { domainEventBus } from '../../../events/domainEvents.js';
import {
  ScheduleInterviewDto,
  UpdateInterviewDto,
  SubmitFeedbackDto,
} from '../dto/interview.dto.js';
import { IInterview, InterviewStatus } from '../../../database/models/Interview.js';
import { IInterviewFeedback } from '../../../database/models/InterviewFeedback.js';

export class InterviewService {
  private repo = new InterviewRepository();

  async scheduleInterview(employerId: string, dto: ScheduleInterviewDto): Promise<IInterview> {
    const application = await JobApplication.findById(dto.applicationId);
    if (!application || application.isDeleted) {
      throw new AppError('Application not found', 404, 'NOT_FOUND');
    }

    const scheduledDate = new Date(dto.scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      throw new AppError('Invalid scheduledAt date format', 400, 'BAD_REQUEST');
    }

    const interview = await this.repo.createInterview({
      application: application._id,
      job: application.job,
      candidate: application.applicant,
      employer: application.employer,
      interviewers: dto.interviewerIds ? (dto.interviewerIds as never[]) : [application.employer],
      type: dto.type,
      scheduledAt: scheduledDate,
      durationMinutes: dto.durationMinutes || 45,
      timeZone: dto.timeZone || 'UTC',
      locationOrLink: dto.locationOrLink,
      platform: dto.platform || 'Google Meet',
      notes: dto.notes,
      status: 'SCHEDULED',
    });

    // Update application stage automatically
    application.status = 'INTERVIEW_SCHEDULED';
    await application.save();

    domainEventBus.publish({
      eventType: 'INTERVIEW_SCHEDULED',
      applicationId: application._id.toString(),
      jobId: application.job.toString(),
      candidateId: application.applicant.toString(),
      actorId: employerId,
      payload: { interviewId: interview._id.toString(), type: dto.type, scheduledAt: scheduledDate },
    });

    return interview;
  }

  async getInterviewById(interviewId: string): Promise<IInterview> {
    const interview = await this.repo.findById(interviewId);
    if (!interview) {
      throw new AppError('Interview not found', 404, 'NOT_FOUND');
    }
    return interview;
  }

  async getCandidateInterviews(candidateId: string): Promise<IInterview[]> {
    return this.repo.findByCandidateId(candidateId);
  }

  async getEmployerInterviews(employerId: string): Promise<IInterview[]> {
    return this.repo.findByEmployerId(employerId);
  }

  async getApplicationInterviews(applicationId: string): Promise<IInterview[]> {
    return this.repo.findByApplicationId(applicationId);
  }

  async updateInterviewStatus(
    interviewId: string,
    actorId: string,
    status: InterviewStatus,
    reason?: string
  ): Promise<IInterview> {
    const interview = await this.getInterviewById(interviewId);

    const updated = await this.repo.updateStatus(interviewId, status, reason);
    if (!updated) {
      throw new AppError('Failed to update interview', 500, 'SERVER_ERROR');
    }

    if (status === 'COMPLETED') {
      await JobApplication.findByIdAndUpdate(interview.application, { status: 'INTERVIEW_COMPLETED' });
    }

    domainEventBus.publish({
      eventType: status === 'COMPLETED' ? 'INTERVIEW_COMPLETED' : 'INTERVIEW_CANCELLED',
      applicationId: interview.application.toString(),
      jobId: interview.job.toString(),
      candidateId: interview.candidate.toString(),
      actorId,
      payload: { interviewId, status, reason },
    });

    return updated;
  }

  async updateInterview(interviewId: string, actorId: string, dto: UpdateInterviewDto): Promise<IInterview> {
    const interview = await this.getInterviewById(interviewId);

    const updatePayload: Partial<IInterview> = {};
    if (dto.scheduledAt) updatePayload.scheduledAt = new Date(dto.scheduledAt);
    if (dto.durationMinutes) updatePayload.durationMinutes = dto.durationMinutes;
    if (dto.locationOrLink !== undefined) updatePayload.locationOrLink = dto.locationOrLink;
    if (dto.platform !== undefined) updatePayload.platform = dto.platform;
    if (dto.notes !== undefined) updatePayload.notes = dto.notes;
    if (dto.type) updatePayload.type = dto.type;

    const updated = await this.repo.updateInterview(interviewId, updatePayload);
    if (!updated) {
      throw new AppError('Failed to update interview', 500, 'SERVER_ERROR');
    }

    domainEventBus.publish({
      eventType: 'INTERVIEW_RESCHEDULED',
      applicationId: interview.application.toString(),
      jobId: interview.job.toString(),
      candidateId: interview.candidate.toString(),
      actorId,
      payload: { interviewId, updatedFields: updatePayload },
    });

    return updated;
  }

  async submitFeedback(interviewId: string, interviewerId: string, dto: SubmitFeedbackDto): Promise<IInterviewFeedback> {
    const interview = await this.getInterviewById(interviewId);

    const feedback = await this.repo.createFeedback({
      interview: interview._id,
      application: interview.application,
      interviewer: interviewerId as never,
      overallRating: dto.overallRating,
      recommendation: dto.recommendation,
      skillScores: dto.skillScores || [],
      strengths: dto.strengths,
      weaknesses: dto.weaknesses,
      comments: dto.comments,
      isPrivate: true,
    });

    domainEventBus.publish({
      eventType: 'FEEDBACK_SUBMITTED',
      applicationId: interview.application.toString(),
      jobId: interview.job.toString(),
      candidateId: interview.candidate.toString(),
      actorId: interviewerId,
      payload: { interviewId, overallRating: dto.overallRating, recommendation: dto.recommendation },
    });

    return feedback;
  }

  async getInterviewFeedback(interviewId: string): Promise<IInterviewFeedback[]> {
    return this.repo.findFeedbackByInterview(interviewId);
  }
}
