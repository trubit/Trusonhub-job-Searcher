import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InterviewService } from '../../../src/server/modules/interviews/services/interview.service';
import { JobApplication } from '../../../src/server/database/models/JobApplication';
import { Interview } from '../../../src/server/database/models/Interview';
import { InterviewFeedback } from '../../../src/server/database/models/InterviewFeedback';

vi.mock('../../../src/server/database/models/JobApplication');
vi.mock('../../../src/server/database/models/Interview');
vi.mock('../../../src/server/database/models/InterviewFeedback');
vi.mock('../../../src/server/events/domainEvents', () => ({
  domainEventBus: {
    publish: vi.fn(),
  },
}));

describe('Interview Management Suite', () => {
  let service: InterviewService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new InterviewService();
  });

  describe('scheduleInterview', () => {
    it('schedules an interview and updates application status to INTERVIEW_SCHEDULED', async () => {
      const mockApplication = {
        _id: 'app123',
        job: 'job123',
        applicant: 'candidate123',
        employer: 'employer123',
        status: 'SUBMITTED',
        save: vi.fn().mockResolvedValue(true),
      };

      const mockInterview = {
        _id: 'interview123',
        application: 'app123',
        type: 'VIDEO',
        scheduledAt: new Date(),
      };

      vi.mocked(JobApplication.findById).mockResolvedValue(mockApplication as never);
      vi.mocked(Interview.prototype.save).mockResolvedValue(mockInterview as never);

      const result = await service.scheduleInterview('employer123', {
        applicationId: 'app123',
        type: 'VIDEO',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 45,
      });

      expect(result).toBeDefined();
      expect(mockApplication.status).toBe('INTERVIEW_SCHEDULED');
      expect(mockApplication.save).toHaveBeenCalled();
    });

    it('throws 404 if application is not found', async () => {
      vi.mocked(JobApplication.findById).mockResolvedValue(null);

      await expect(
        service.scheduleInterview('employer123', {
          applicationId: 'invalidApp',
          type: 'VIDEO',
          scheduledAt: new Date().toISOString(),
        })
      ).rejects.toThrow('Application not found');
    });
  });

  describe('submitFeedback', () => {
    it('saves scorecard feedback and returns the created record', async () => {
      const mockInterview = {
        _id: 'interview123',
        application: 'app123',
        job: 'job123',
        candidate: 'candidate123',
      };

      const mockFeedback = {
        _id: 'feedback123',
        interview: 'interview123',
        overallRating: 5,
        recommendation: 'STRONG_HIRE',
      };

      vi.spyOn(service, 'getInterviewById').mockResolvedValue(mockInterview as never);
      vi.mocked(InterviewFeedback.prototype.save).mockResolvedValue(mockFeedback as never);

      const result = await service.submitFeedback('interview123', 'interviewer123', {
        overallRating: 5,
        recommendation: 'STRONG_HIRE',
        strengths: 'Excellent system design skills',
      });

      expect(result).toBeDefined();
    });
  });
});
