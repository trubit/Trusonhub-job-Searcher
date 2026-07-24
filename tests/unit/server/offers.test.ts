import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OfferService } from '../../../src/server/modules/offers/services/offer.service';
import { JobApplication } from '../../../src/server/database/models/JobApplication';
import { JobOffer } from '../../../src/server/database/models/JobOffer';

vi.mock('../../../src/server/database/models/JobApplication');
vi.mock('../../../src/server/database/models/JobOffer');
vi.mock('../../../src/server/events/domainEvents', () => ({
  domainEventBus: {
    publish: vi.fn(),
  },
}));

describe('Job Offer Management Suite', () => {
  let service: OfferService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OfferService();
  });

  describe('acceptOffer', () => {
    it('updates offer status to ACCEPTED and updates job application stage to HIRED', async () => {
      const mockOffer = {
        _id: 'offer123',
        application: 'app123',
        job: 'job123',
        candidate: 'candidate123',
        expirationDate: new Date(Date.now() + 86400000 * 7),
      };

      const chain = {
        populate: vi.fn().mockReturnThis(),
        then: (resolve: (val: unknown) => void) => resolve(mockOffer),
      };
      vi.mocked(JobOffer.findOne).mockReturnValue(chain as never);
      vi.mocked(JobOffer.findOneAndUpdate).mockResolvedValue({ ...mockOffer, status: 'ACCEPTED' } as never);

      const result = await service.acceptOffer('offer123', 'candidate123');

      expect(result.status).toBe('ACCEPTED');
      expect(JobApplication.findByIdAndUpdate).toHaveBeenCalledWith('app123', { status: 'HIRED' });
    });

    it('throws error if offer expiration date has passed', async () => {
      const expiredOffer = {
        _id: 'offer123',
        expirationDate: new Date(Date.now() - 86400000),
      };

      const chain = {
        populate: vi.fn().mockReturnThis(),
        then: (resolve: (val: unknown) => void) => resolve(expiredOffer),
      };
      vi.mocked(JobOffer.findOne).mockReturnValue(chain as never);
      vi.mocked(JobOffer.findOneAndUpdate).mockResolvedValue(expiredOffer as never);

      await expect(service.acceptOffer('offer123', 'candidate123')).rejects.toThrow('This job offer has expired');
    });
  });
});
