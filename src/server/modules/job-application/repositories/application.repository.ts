import { JobApplication, IJobApplication } from '../../../database/models/JobApplication.js';

export class JobApplicationRepository {
  async create(data: Partial<IJobApplication>): Promise<IJobApplication> {
    return JobApplication.create(data);
  }

  async findById(id: string): Promise<IJobApplication | null> {
    return JobApplication.findOne({ _id: id, isDeleted: false })
      .populate('job')
      .populate({ path: 'applicant', select: 'firstName lastName email avatarUrl phone location headline' })
      .populate('company')
      .populate('resume');
  }

  async findByJobAndApplicant(jobId: string, applicantId: string): Promise<IJobApplication | null> {
    return JobApplication.findOne({ job: jobId, applicant: applicantId, isDeleted: false });
  }

  async findByApplicant(applicantId: string): Promise<IJobApplication[]> {
    return JobApplication.find({ applicant: applicantId, isDeleted: false })
      .populate('job')
      .populate('company')
      .sort({ createdAt: -1 });
  }

  async update(id: string, applicantId: string, data: Partial<IJobApplication>): Promise<IJobApplication | null> {
    return JobApplication.findOneAndUpdate(
      { _id: id, applicant: applicantId, isDeleted: false },
      data,
      { new: true }
    );
  }

  async softDelete(id: string, applicantId: string): Promise<boolean> {
    const res = await JobApplication.updateOne(
      { _id: id, applicant: applicantId },
      { isDeleted: true, deletedAt: new Date() }
    );
    return res.modifiedCount > 0;
  }
}
