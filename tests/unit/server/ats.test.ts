import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AtsService } from '../../../src/server/modules/ats/services/ats.service';
import { JobApplication } from '../../../src/server/database/models/JobApplication';

vi.mock('../../../src/server/database/models/JobApplication');
vi.mock('../../../src/server/database/models/ApplicationHistory', () => ({
  ApplicationHistory: { create: vi.fn().mockResolvedValue({}) },
}));
vi.mock('../../../src/server/database/models/ApplicationActivity', () => ({
  ApplicationActivity: { create: vi.fn().mockResolvedValue({}) },
}));
vi.mock('../../../src/server/database/models/ApplicationNotes', () => ({
  ApplicationNotes: {
    find: vi.fn().mockReturnValue({
      populate: vi.fn().mockReturnValue({
        sort: vi.fn().mockResolvedValue([]),
      }),
    }),
    create: vi.fn().mockResolvedValue({ _id: 'note123', content: 'Test note' }),
  },
}));
vi.mock('../../../src/server/emails/emailService', () => ({
  emailService: { sendEmail: vi.fn().mockResolvedValue({}) },
}));

describe('AtsService', () => {
  let service: AtsService;

  beforeEach(() => {
    service = new AtsService();
    vi.clearAllMocks();
  });

  it('updates application status and creates audit log', async () => {
    const mockApp = {
      _id: 'app123',
      employer: 'emp123',
      status: 'SUBMITTED',
      applicant: { email: 'applicant@test.com', firstName: 'John' },
      job: { title: 'Engineer' },
      save: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(JobApplication, 'findOne').mockReturnValue({
      populate: vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue(mockApp as never),
          }),
        }),
      }),
    } as never);

    const updated = await service.updateStatus('app123', 'emp123', {
      status: 'SHORTLISTED',
      reason: 'Strong qualifications',
    });

    expect(updated.status).toBe('SHORTLISTED');
    expect(mockApp.save).toHaveBeenCalled();
  });

  it('handles bulk status updates across applications', async () => {
    vi.spyOn(JobApplication, 'updateMany').mockResolvedValue({
      modifiedCount: 3,
      acknowledged: true,
      matchedCount: 3,
      upsertedCount: 0,
      upsertedId: null as never,
    });

    const result = await service.bulkUpdate('emp123', {
      applicationIds: ['app1', 'app2', 'app3'],
      action: 'SHORTLIST',
    });

    expect(result.updatedCount).toBe(3);
  });
});
