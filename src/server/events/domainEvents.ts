import { EventEmitter } from 'events';
import { RecruitmentEvent, EventType } from '../database/models/RecruitmentEvent.js';
import { logger } from '../utils/logger.js';

export interface DomainEventPayload {
  eventType: EventType;
  applicationId: string;
  jobId?: string;
  candidateId?: string;
  actorId?: string;
  payload?: Record<string, unknown>;
}

class DomainEventBus extends EventEmitter {
  constructor() {
    super();
    this.on('recruitment_event', this.handleRecruitmentEvent.bind(this));
  }

  public publish(event: DomainEventPayload): void {
    this.emit('recruitment_event', event);
  }

  private async handleRecruitmentEvent(event: DomainEventPayload): Promise<void> {
    try {
      logger.info(`[DomainEvent] ${event.eventType} for App ${event.applicationId}`);

      await RecruitmentEvent.create({
        eventType: event.eventType,
        applicationId: event.applicationId,
        jobId: event.jobId,
        candidateId: event.candidateId,
        actorId: event.actorId,
        payload: event.payload || {},
      });
    } catch (err) {
      logger.error(`[DomainEvent Error] Failed to persist event ${event.eventType}:`, err);
    }
  }
}

export const domainEventBus = new DomainEventBus();
