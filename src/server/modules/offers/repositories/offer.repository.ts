import { JobOffer, IJobOffer, OfferStatus } from '../../../database/models/JobOffer.js';

export class OfferRepository {
  async createOffer(data: Partial<IJobOffer>): Promise<IJobOffer> {
    const offer = new JobOffer(data);
    return offer.save();
  }

  async findById(id: string): Promise<IJobOffer | null> {
    return JobOffer.findOne({ _id: id, isDeleted: false })
      .populate('candidate', 'firstName lastName email avatarUrl')
      .populate('employer', 'firstName lastName email companyName')
      .populate('job', 'title city country employmentType');
  }

  async findByApplicationId(applicationId: string): Promise<IJobOffer[]> {
    return JobOffer.find({ application: applicationId, isDeleted: false }).sort({ version: -1 });
  }

  async findByEmployerId(employerId: string): Promise<IJobOffer[]> {
    return JobOffer.find({ employer: employerId, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('candidate', 'firstName lastName email avatarUrl')
      .populate('job', 'title city country employmentType');
  }

  async findByCandidateId(candidateId: string): Promise<IJobOffer[]> {
    return JobOffer.find({ candidate: candidateId, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('employer', 'firstName lastName email companyName')
      .populate('job', 'title city country employmentType');
  }

  async updateOffer(id: string, updateData: Partial<IJobOffer>): Promise<IJobOffer | null> {
    return JobOffer.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true });
  }

  async updateStatus(id: string, status: OfferStatus, extraFields: Partial<IJobOffer> = {}): Promise<IJobOffer | null> {
    return JobOffer.findOneAndUpdate({ _id: id, isDeleted: false }, { status, ...extraFields }, { new: true });
  }
}
