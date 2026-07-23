import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JobApplicationService } from '../../../src/server/modules/job-application/services/application.service';
import { Job } from '../../../src/server/database/models/Job';
import { JobApplication } from '../../../src/server/database/models/JobApplication';

vi.mock('../../../src/server/database/models/Job');
vi.mock('../../../src/server/database/models/JobApplication');
vi.mock('../../../src/server/database/models/ApplicationActivity', () => ({
  ApplicationActivity: { create: vi.fn().mockResolvedValue({}) },
}));
vi.mock('../../../src/server/database/models/ApplicationHistory', () => ({
  ApplicationHistory: { create: vi.fn().mockResolvedValue({}) },
}));
vi.mock('../../../src/server/emails/emailService', () => ({
  emailService: { sendEmail: vi.fn().mockResolvedValue({}) },
}));

describe('JobApplicationService', () => {
  let service: JobApplicationService;

  beforeEach(() => {
    service = new JobApplicationService();
    vi.clearAllMocks();
  });

  it('throws 404 error if job position does not exist', async () => {
    vi.spyOn(Job, 'findOne').mockResolvedValue(null as never);

    await expect(
      service.applyToJob('applicant123', { jobId: 'invalidJobId' })
    ).rejects.toThrow('Job listing not found');
  });

  it('throws 400 error if job status is not PUBLISHED', async () => {
    vi.spyOn(Job, 'findOne').mockResolvedValue({
      _id: 'job123',
      status: 'DRAFT',
      employer: 'emp123',
      company: 'comp123',
    } as never);

    await expect(
      service.applyToJob('applicant123', { jobId: 'job123' })
    ).rejects.toThrow('This job is no longer accepting applications');
  });

  it('successfully creates job application when valid', async () => {
    vi.spyOn(Job, 'findOne').mockResolvedValue({
      _id: 'job123',
      status: 'PUBLISHED',
      employer: 'emp123',
      company: 'comp123',
    } as never);

    vi.spyOn(JobApplication, 'findOne').mockResolvedValue(null as never);
    vi.spyOn(JobApplication, 'create').mockResolvedValue({
      _id: 'app123',
      job: 'job123',
      applicant: 'applicant123',
      status: 'SUBMITTED',
    } as never);

    const app = await service.applyToJob('applicant123', {
      jobId: 'job123',
      coverLetter: 'Test cover letter',
    });

    expect(app).toBeDefined();
    expect(app.status).toBe('SUBMITTED');
  });
});
