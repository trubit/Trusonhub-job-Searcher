import { HiringDecision, IHiringDecision } from '../../../database/models/HiringDecision.js';

export class HiringRepository {
  async createDecision(data: Partial<IHiringDecision>): Promise<IHiringDecision> {
    const decision = new HiringDecision(data);
    return decision.save();
  }

  async findByApplicationId(applicationId: string): Promise<IHiringDecision[]> {
    return HiringDecision.find({ application: applicationId, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('decidedBy', 'firstName lastName email avatarUrl');
  }
}
