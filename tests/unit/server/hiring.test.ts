import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HiringService } from '../../../src/server/modules/hiring/services/hiring.service';
import { JobApplication } from '../../../src/server/database/models/JobApplication';
import { HiringDecision } from '../../../src/server/database/models/HiringDecision';

vi.mock('../../../src/server/database/models/JobApplication');
vi.mock('../../../src/server/database/models/HiringDecision');
vi.mock('../../../src/server/events/domainEvents', () => ({
  domainEventBus: {
    publish: vi.fn(),
  },
}));

describe('Hiring Decision Suite', () => {
  let service: HiringService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new HiringService();
  });

  it('records an APPROVED hiring decision and updates application stage to SHORTLISTED', async () => {
    const mockApp = {
      _id: 'app123',
      job: 'job123',
      applicant: 'candidate123',
      status: 'UNDER_REVIEW',
      save: vi.fn().mockResolvedValue(true),
    };

    const mockDecision = {
      _id: 'decision123',
      decision: 'APPROVED',
    };

    vi.mocked(JobApplication.findById).mockResolvedValue(mockApp as never);
    vi.mocked(HiringDecision.prototype.save).mockResolvedValue(mockDecision as never);

    const result = await service.makeDecision('manager123', {
      applicationId: 'app123',
      decision: 'APPROVED',
      reason: 'Outstanding technical performance',
    });

    expect(result).toBeDefined();
    expect(mockApp.status).toBe('SHORTLISTED');
    expect(mockApp.save).toHaveBeenCalled();
  });
});
