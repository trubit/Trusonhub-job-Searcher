import { ProfileRepository } from '../repositories/profile.repository.js';
import { calculateProfileCompletion } from '../../../services/profileCompletionEngine.js';
import { User } from '../../../database/models/User.js';
import { AppError } from '../../../utils/AppError.js';

export class ProfileService {
  private repo = new ProfileRepository();

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    if (user.role === 'EMPLOYER' || user.role === 'ADMIN') {
      const profile = await this.repo.getOrCreateEmployerProfile(userId);
      return {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
          role: user.role,
        },
        profile,
      };
    } else {
      return this.getCandidateProfile(userId);
    }
  }

  async getCandidateProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    const profile = await this.repo.getOrCreateJobSeekerProfile(userId);
    const education = await this.repo.getEducationList(userId);
    const experience = await this.repo.getExperienceList(userId);
    const skills = await this.repo.getSkillList(userId);
    const certifications = await this.repo.getCertificationList(userId);
    const languages = await this.repo.getLanguageList(userId);
    const portfolio = await this.repo.getPortfolioList(userId);
    const hasResume = await this.repo.hasResume(userId);

    // Calculate completion score
    const completion = calculateProfileCompletion({
      hasPhoto: Boolean(user.avatarUrl),
      headline: profile.headline,
      about: profile.about,
      experienceCount: experience.length,
      educationCount: education.length,
      skillsCount: skills.length,
      hasResume,
      portfolioCount: portfolio.length,
    });

    if (profile.completionPercentage !== completion.score) {
      profile.completionPercentage = completion.score;
      await profile.save();
    }

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      profile,
      education,
      experience,
      skills,
      certifications,
      languages,
      portfolio,
      completion,
    };
  }

  async updateProfile(userId: string, data: Record<string, unknown>) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    if (typeof data.firstName === 'string') user.firstName = data.firstName;
    if (typeof data.lastName === 'string') user.lastName = data.lastName;
    await user.save();

    if (user.role === 'EMPLOYER' || user.role === 'ADMIN') {
      const updateData: Record<string, unknown> = {};
      if (data.position !== undefined) updateData.position = data.position;
      if (data.department !== undefined) updateData.department = data.department;
      if (data.businessEmail !== undefined) updateData.businessEmail = data.businessEmail;
      if (data.phone !== undefined) updateData.phone = data.phone;

      await this.repo.updateEmployerProfile(userId, updateData);
      return this.getProfile(userId);
    } else {
      await this.repo.updateJobSeekerProfile(userId, data);
      return this.getProfile(userId);
    }
  }

  async updateCandidateProfile(userId: string, data: Record<string, unknown>) {
    await this.repo.updateJobSeekerProfile(userId, data);
    return this.getCandidateProfile(userId);
  }

  async deleteProfilePhoto(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    user.avatarUrl = undefined;
    await user.save();
    return this.getProfile(userId);
  }

  async getPublicProfileByUsername(username: string) {
    const user = await User.findOne({ username: username.toLowerCase(), isDeleted: false });
    if (!user) throw new AppError('Candidate profile not found', 404, 'NOT_FOUND');

    return this.getCandidateProfile(user._id.toString());
  }

  // Education Sub-module
  async addEducation(userId: string, data: Record<string, unknown>) {
    await this.repo.addEducation(userId, data);
    return this.getCandidateProfile(userId);
  }

  async updateEducation(id: string, userId: string, data: Record<string, unknown>) {
    await this.repo.updateEducation(id, userId, data);
    return this.getCandidateProfile(userId);
  }

  async deleteEducation(id: string, userId: string) {
    await this.repo.deleteEducation(id, userId);
    return this.getCandidateProfile(userId);
  }

  // Experience Sub-module
  async addExperience(userId: string, data: Record<string, unknown>) {
    await this.repo.addExperience(userId, data);
    return this.getCandidateProfile(userId);
  }

  async updateExperience(id: string, userId: string, data: Record<string, unknown>) {
    await this.repo.updateExperience(id, userId, data);
    return this.getCandidateProfile(userId);
  }

  async deleteExperience(id: string, userId: string) {
    await this.repo.deleteExperience(id, userId);
    return this.getCandidateProfile(userId);
  }

  // Skills Sub-module
  async addSkill(userId: string, data: Record<string, unknown>) {
    await this.repo.addSkill(userId, data);
    return this.getCandidateProfile(userId);
  }

  async updateSkill(id: string, userId: string, data: Record<string, unknown>) {
    await this.repo.updateSkill(id, userId, data);
    return this.getCandidateProfile(userId);
  }

  async deleteSkill(id: string, userId: string) {
    await this.repo.deleteSkill(id, userId);
    return this.getCandidateProfile(userId);
  }

  // Certifications Sub-module
  async addCertification(userId: string, data: Record<string, unknown>) {
    await this.repo.addCertification(userId, data);
    return this.getCandidateProfile(userId);
  }

  async updateCertification(id: string, userId: string, data: Record<string, unknown>) {
    await this.repo.updateCertification(id, userId, data);
    return this.getCandidateProfile(userId);
  }

  async deleteCertification(id: string, userId: string) {
    await this.repo.deleteCertification(id, userId);
    return this.getCandidateProfile(userId);
  }

  // Languages Sub-module
  async addLanguage(userId: string, data: Record<string, unknown>) {
    await this.repo.addLanguage(userId, data);
    return this.getCandidateProfile(userId);
  }

  async updateLanguage(id: string, userId: string, data: Record<string, unknown>) {
    await this.repo.updateLanguage(id, userId, data);
    return this.getCandidateProfile(userId);
  }

  async deleteLanguage(id: string, userId: string) {
    await this.repo.deleteLanguage(id, userId);
    return this.getCandidateProfile(userId);
  }

  // Portfolio Sub-module
  async addPortfolio(userId: string, data: Record<string, unknown>) {
    await this.repo.addPortfolio(userId, data);
    return this.getCandidateProfile(userId);
  }

  async updatePortfolio(id: string, userId: string, data: Record<string, unknown>) {
    await this.repo.updatePortfolio(id, userId, data);
    return this.getCandidateProfile(userId);
  }

  async deletePortfolio(id: string, userId: string) {
    await this.repo.deletePortfolio(id, userId);
    return this.getCandidateProfile(userId);
  }
}
