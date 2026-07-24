import { OfferRepository } from '../repositories/offer.repository.js';
import { JobApplication } from '../../../database/models/JobApplication.js';
import { AppError } from '../../../utils/AppError.js';
import { domainEventBus } from '../../../events/domainEvents.js';
import { CreateOfferDto, UpdateOfferDto, RespondOfferDto } from '../dto/offer.dto.js';
import { IJobOffer } from '../../../database/models/JobOffer.js';

export class OfferService {
  private repo = new OfferRepository();

  async createOffer(employerId: string, dto: CreateOfferDto): Promise<IJobOffer> {
    const application = await JobApplication.findById(dto.applicationId);
    if (!application || application.isDeleted) {
      throw new AppError('Application not found', 404, 'NOT_FOUND');
    }

    const existingOffers = await this.repo.findByApplicationId(dto.applicationId);
    const version = existingOffers.length + 1;

    const offer = await this.repo.createOffer({
      application: application._id,
      job: application.job,
      candidate: application.applicant,
      employer: application.employer,
      positionTitle: dto.positionTitle,
      salary: dto.salary,
      currency: dto.currency || 'USD',
      benefits: dto.benefits || [],
      startDate: new Date(dto.startDate),
      expirationDate: new Date(dto.expirationDate),
      terms: dto.terms,
      status: 'DRAFT',
      version,
    });

    domainEventBus.publish({
      eventType: 'OFFER_CREATED',
      applicationId: application._id.toString(),
      jobId: application.job.toString(),
      candidateId: application.applicant.toString(),
      actorId: employerId,
      payload: { offerId: offer._id.toString(), salary: dto.salary, version },
    });

    return offer;
  }

  async sendOffer(offerId: string, employerId: string): Promise<IJobOffer> {
    const offer = await this.repo.findById(offerId);
    if (!offer) {
      throw new AppError('Job offer not found', 404, 'NOT_FOUND');
    }

    const updated = await this.repo.updateStatus(offerId, 'SENT', { sentAt: new Date() });
    if (!updated) {
      throw new AppError('Failed to send offer', 500, 'SERVER_ERROR');
    }

    // Automatically update JobApplication stage
    await JobApplication.findByIdAndUpdate(offer.application, { status: 'OFFER_EXTENDED' });

    domainEventBus.publish({
      eventType: 'OFFER_SENT',
      applicationId: offer.application.toString(),
      jobId: offer.job.toString(),
      candidateId: offer.candidate.toString(),
      actorId: employerId,
      payload: { offerId },
    });

    return updated;
  }

  async acceptOffer(offerId: string, candidateId: string): Promise<IJobOffer> {
    const offer = await this.repo.findById(offerId);
    if (!offer) {
      throw new AppError('Job offer not found', 404, 'NOT_FOUND');
    }

    if (offer.expirationDate < new Date()) {
      await this.repo.updateStatus(offerId, 'EXPIRED');
      throw new AppError('This job offer has expired', 400, 'OFFER_EXPIRED');
    }

    const updated = await this.repo.updateStatus(offerId, 'ACCEPTED', { acceptedAt: new Date() });
    if (!updated) {
      throw new AppError('Failed to accept offer', 500, 'SERVER_ERROR');
    }

    // Automatically transition candidate application stage to HIRED
    await JobApplication.findByIdAndUpdate(offer.application, { status: 'HIRED' });

    domainEventBus.publish({
      eventType: 'OFFER_ACCEPTED',
      applicationId: offer.application.toString(),
      jobId: offer.job.toString(),
      candidateId: offer.candidate.toString(),
      actorId: candidateId,
      payload: { offerId, acceptedAt: new Date() },
    });

    return updated;
  }

  async declineOffer(offerId: string, candidateId: string, dto: RespondOfferDto): Promise<IJobOffer> {
    const offer = await this.repo.findById(offerId);
    if (!offer) {
      throw new AppError('Job offer not found', 404, 'NOT_FOUND');
    }

    const updated = await this.repo.updateStatus(offerId, 'DECLINED', {
      declinedAt: new Date(),
      declineReason: dto.reason,
    });

    if (!updated) {
      throw new AppError('Failed to decline offer', 500, 'SERVER_ERROR');
    }

    domainEventBus.publish({
      eventType: 'OFFER_DECLINED',
      applicationId: offer.application.toString(),
      jobId: offer.job.toString(),
      candidateId: offer.candidate.toString(),
      actorId: candidateId,
      payload: { offerId, reason: dto.reason },
    });

    return updated;
  }

  async withdrawOffer(offerId: string, employerId: string, dto: RespondOfferDto): Promise<IJobOffer> {
    const offer = await this.repo.findById(offerId);
    if (!offer) {
      throw new AppError('Job offer not found', 404, 'NOT_FOUND');
    }

    const updated = await this.repo.updateStatus(offerId, 'WITHDRAWN', { withdrawalReason: dto.reason });
    if (!updated) {
      throw new AppError('Failed to withdraw offer', 500, 'SERVER_ERROR');
    }

    domainEventBus.publish({
      eventType: 'OFFER_WITHDRAWN',
      applicationId: offer.application.toString(),
      jobId: offer.job.toString(),
      candidateId: offer.candidate.toString(),
      actorId: employerId,
      payload: { offerId, reason: dto.reason },
    });

    return updated;
  }

  async getOfferById(offerId: string): Promise<IJobOffer> {
    const offer = await this.repo.findById(offerId);
    if (!offer) {
      throw new AppError('Job offer not found', 404, 'NOT_FOUND');
    }
    return offer;
  }

  async getEmployerOffers(employerId: string): Promise<IJobOffer[]> {
    return this.repo.findByEmployerId(employerId);
  }

  async getCandidateOffers(candidateId: string): Promise<IJobOffer[]> {
    return this.repo.findByCandidateId(candidateId);
  }

  async getApplicationOffers(applicationId: string): Promise<IJobOffer[]> {
    return this.repo.findByApplicationId(applicationId);
  }

  async updateOffer(offerId: string, dto: UpdateOfferDto): Promise<IJobOffer> {
    const updatePayload: Partial<IJobOffer> = {};
    if (dto.positionTitle) updatePayload.positionTitle = dto.positionTitle;
    if (dto.salary !== undefined) updatePayload.salary = dto.salary;
    if (dto.currency) updatePayload.currency = dto.currency;
    if (dto.benefits) updatePayload.benefits = dto.benefits;
    if (dto.startDate) updatePayload.startDate = new Date(dto.startDate);
    if (dto.expirationDate) updatePayload.expirationDate = new Date(dto.expirationDate);
    if (dto.terms !== undefined) updatePayload.terms = dto.terms;

    const updated = await this.repo.updateOffer(offerId, updatePayload);
    if (!updated) {
      throw new AppError('Offer not found or update failed', 404, 'NOT_FOUND');
    }
    return updated;
  }
}
