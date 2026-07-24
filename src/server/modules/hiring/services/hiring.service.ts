import { HiringRepository } from '../repositories/hiring.repository.js';
import { JobApplication } from '../../../database/models/JobApplication.js';
import { ApplicationStage } from '../../../database/models/ApplicationStatus.js';
import { AppError } from '../../../utils/AppError.js';
import { domainEventBus } from '../../../events/domainEvents.js';
import { MakeDecisionDto } from '../dto/hiring.dto.js';
import { IHiringDecision } from '../../../database/models/HiringDecision.js';

export class HiringService {
  private repo = new HiringRepository();

  async makeDecision(actorId: string, dto: MakeDecisionDto): Promise<IHiringDecision> {
    const application = await JobApplication.findById(dto.applicationId);
    if (!application || application.isDeleted) {
      throw new AppError('Application not found', 404, 'NOT_FOUND');
    }

    const decision = await this.repo.createDecision({
      application: application._id,
      job: application.job,
      candidate: application.applicant,
      decidedBy: actorId as never,
      decision: dto.decision,
      reason: dto.reason,
      notes: dto.notes,
    });

    // Auto-sync Application Stage
    let newStage: ApplicationStage | null = null;
    if (dto.decision === 'REJECTED') {
      newStage = 'REJECTED';
    } else if (dto.decision === 'APPROVED') {
      newStage = 'SHORTLISTED';
    }

    if (newStage) {
      application.status = newStage;
      await application.save();
    }

    domainEventBus.publish({
      eventType: 'HIRING_DECISION_MADE',
      applicationId: application._id.toString(),
      jobId: application.job.toString(),
      candidateId: application.applicant.toString(),
      actorId,
      payload: { decision: dto.decision, reason: dto.reason },
    });

    return decision;
  }

  async getApplicationDecisions(applicationId: string): Promise<IHiringDecision[]> {
    return this.repo.findByApplicationId(applicationId);
  }
}
