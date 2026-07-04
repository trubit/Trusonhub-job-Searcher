import { JobBookmarkRepository } from '../repositories/job-bookmark.repository.js';
import { ISavedJob } from '../../../database/models/SavedJob.js';
import { AppError } from '../../../utils/AppError.js';

export class JobBookmarkService {
  private repo = new JobBookmarkRepository();

  async bookmarkJob(userId: string, jobId: string): Promise<ISavedJob> {
    if (!jobId) throw new AppError('Job ID is required', 400);
    return this.repo.createBookmark(userId, jobId);
  }

  async unbookmarkJob(userId: string, jobId: string): Promise<void> {
    if (!jobId) throw new AppError('Job ID is required', 400);
    const success = await this.repo.removeBookmark(userId, jobId);
    if (!success) throw new AppError('Bookmark not found', 404);
  }

  async getSavedJobs(userId: string): Promise<ISavedJob[]> {
    return this.repo.getSavedJobs(userId);
  }
}
