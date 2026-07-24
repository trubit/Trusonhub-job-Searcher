import { Interview, IInterview, InterviewStatus } from '../../../database/models/Interview.js';
import { InterviewFeedback, IInterviewFeedback } from '../../../database/models/InterviewFeedback.js';

export class InterviewRepository {
  async createInterview(data: Partial<IInterview>): Promise<IInterview> {
    const interview = new Interview(data);
    return interview.save();
  }

  async findById(id: string): Promise<IInterview | null> {
    return Interview.findOne({ _id: id, isDeleted: false })
      .populate('candidate', 'firstName lastName email avatarUrl')
      .populate('employer', 'firstName lastName email companyName')
      .populate('job', 'title city country employmentType')
      .populate('interviewers', 'firstName lastName email avatarUrl');
  }

  async findByApplicationId(applicationId: string): Promise<IInterview[]> {
    return Interview.find({ application: applicationId, isDeleted: false })
      .sort({ scheduledAt: -1 })
      .populate('interviewers', 'firstName lastName email avatarUrl');
  }

  async findByEmployerId(employerId: string): Promise<IInterview[]> {
    return Interview.find({ employer: employerId, isDeleted: false })
      .sort({ scheduledAt: -1 })
      .populate('candidate', 'firstName lastName email avatarUrl')
      .populate('job', 'title city country employmentType');
  }

  async findByCandidateId(candidateId: string): Promise<IInterview[]> {
    return Interview.find({ candidate: candidateId, isDeleted: false })
      .sort({ scheduledAt: -1 })
      .populate('employer', 'firstName lastName email companyName')
      .populate('job', 'title city country employmentType');
  }

  async updateStatus(id: string, status: InterviewStatus, cancellationReason?: string): Promise<IInterview | null> {
    const updatePayload: Record<string, unknown> = { status };
    if (cancellationReason) {
      updatePayload.cancellationReason = cancellationReason;
    }
    return Interview.findOneAndUpdate({ _id: id, isDeleted: false }, updatePayload, { new: true });
  }

  async updateInterview(id: string, updateData: Partial<IInterview>): Promise<IInterview | null> {
    return Interview.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true });
  }

  async createFeedback(data: Partial<IInterviewFeedback>): Promise<IInterviewFeedback> {
    const feedback = new InterviewFeedback(data);
    return feedback.save();
  }

  async findFeedbackByInterview(interviewId: string): Promise<IInterviewFeedback[]> {
    return InterviewFeedback.find({ interview: interviewId, isDeleted: false }).populate(
      'interviewer',
      'firstName lastName email avatarUrl'
    );
  }
}
