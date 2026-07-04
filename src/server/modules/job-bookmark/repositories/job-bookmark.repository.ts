import { SavedJob, ISavedJob } from '../../../database/models/SavedJob.js';
import { Job } from '../../../database/models/Job.js';

export class JobBookmarkRepository {
  async findBookmark(userId: string, jobId: string): Promise<ISavedJob | null> {
    return SavedJob.findOne({ user: userId, job: jobId, isDeleted: false });
  }

  async createBookmark(userId: string, jobId: string): Promise<ISavedJob> {
    const bookmark = await SavedJob.findOneAndUpdate(
      { user: userId, job: jobId },
      { isDeleted: false, deletedAt: null },
      { new: true, upsert: true }
    );
    await Job.findByIdAndUpdate(jobId, { $inc: { totalSaves: 1 } });
    return bookmark;
  }

  async removeBookmark(userId: string, jobId: string): Promise<boolean> {
    const res = await SavedJob.updateOne(
      { user: userId, job: jobId, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() }
    );
    if (res.modifiedCount > 0) {
      await Job.findByIdAndUpdate(jobId, { $inc: { totalSaves: -1 } });
      return true;
    }
    return false;
  }

  async getSavedJobs(userId: string): Promise<ISavedJob[]> {
    return SavedJob.find({ user: userId, isDeleted: false })
      .populate({
        path: 'job',
        match: { isDeleted: false },
        populate: { path: 'company' }
      })
      .sort({ createdAt: -1 });
  }
}
