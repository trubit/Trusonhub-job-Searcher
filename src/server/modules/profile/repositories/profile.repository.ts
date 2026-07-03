import { JobSeekerProfile, IJobSeekerProfile } from '../../../database/models/JobSeekerProfile.js';
import { EmployerProfile, IEmployerProfile } from '../../../database/models/EmployerProfile.js';
import { Education, IEducation } from '../../../database/models/Education.js';
import { Experience, IExperience } from '../../../database/models/Experience.js';
import { Skill, ISkill } from '../../../database/models/Skill.js';
import { Certification, ICertification } from '../../../database/models/Certification.js';
import { Language, ILanguage } from '../../../database/models/Language.js';
import { Portfolio, IPortfolio } from '../../../database/models/Portfolio.js';
import { Resume } from '../../../database/models/Resume.js';
import { User } from '../../../database/models/User.js';

export class ProfileRepository {
  async getOrCreateJobSeekerProfile(userId: string): Promise<IJobSeekerProfile> {
    let profile = await JobSeekerProfile.findOne({ user: userId, isDeleted: false });
    if (!profile) {
      profile = await JobSeekerProfile.create({ user: userId });
    }
    return profile;
  }

  async getOrCreateEmployerProfile(userId: string): Promise<IEmployerProfile> {
    let profile = await EmployerProfile.findOne({ user: userId, isDeleted: false });
    if (!profile) {
      const user = await User.findById(userId);
      profile = await EmployerProfile.create({
        user: userId,
        position: 'Hiring Manager',
        businessEmail: user?.email || '',
      });
    }
    return profile;
  }

  async updateJobSeekerProfile(userId: string, data: Partial<IJobSeekerProfile>): Promise<IJobSeekerProfile> {
    const profile = await this.getOrCreateJobSeekerProfile(userId);
    Object.assign(profile, data);
    return profile.save();
  }

  async updateEmployerProfile(userId: string, data: Partial<IEmployerProfile>): Promise<IEmployerProfile> {
    const profile = await this.getOrCreateEmployerProfile(userId);
    Object.assign(profile, data);
    return profile.save();
  }

  // Education CRUD
  async getEducationList(userId: string): Promise<IEducation[]> {
    return Education.find({ user: userId, isDeleted: false }).sort({ startDate: -1 });
  }

  async addEducation(userId: string, data: Partial<IEducation>): Promise<IEducation> {
    return Education.create({ ...data, user: userId });
  }

  async updateEducation(id: string, userId: string, data: Partial<IEducation>): Promise<IEducation | null> {
    return Education.findOneAndUpdate({ _id: id, user: userId, isDeleted: false }, data, { new: true });
  }

  async deleteEducation(id: string, userId: string): Promise<boolean> {
    const res = await Education.updateOne({ _id: id, user: userId }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }

  // Experience CRUD
  async getExperienceList(userId: string): Promise<IExperience[]> {
    return Experience.find({ user: userId, isDeleted: false }).sort({ startDate: -1 });
  }

  async addExperience(userId: string, data: Partial<IExperience>): Promise<IExperience> {
    return Experience.create({ ...data, user: userId });
  }

  async updateExperience(id: string, userId: string, data: Partial<IExperience>): Promise<IExperience | null> {
    return Experience.findOneAndUpdate({ _id: id, user: userId, isDeleted: false }, data, { new: true });
  }

  async deleteExperience(id: string, userId: string): Promise<boolean> {
    const res = await Experience.updateOne({ _id: id, user: userId }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }

  // Skill CRUD
  async getSkillList(userId: string): Promise<ISkill[]> {
    return Skill.find({ user: userId, isDeleted: false }).sort({ name: 1 });
  }

  async addSkill(userId: string, data: Partial<ISkill>): Promise<ISkill> {
    return Skill.create({ ...data, user: userId });
  }

  async updateSkill(id: string, userId: string, data: Partial<ISkill>): Promise<ISkill | null> {
    return Skill.findOneAndUpdate({ _id: id, user: userId, isDeleted: false }, data, { new: true });
  }

  async deleteSkill(id: string, userId: string): Promise<boolean> {
    const res = await Skill.updateOne({ _id: id, user: userId }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }

  // Certification CRUD
  async getCertificationList(userId: string): Promise<ICertification[]> {
    return Certification.find({ user: userId, isDeleted: false }).sort({ issueDate: -1 });
  }

  async addCertification(userId: string, data: Partial<ICertification>): Promise<ICertification> {
    return Certification.create({ ...data, user: userId });
  }

  async updateCertification(id: string, userId: string, data: Partial<ICertification>): Promise<ICertification | null> {
    return Certification.findOneAndUpdate({ _id: id, user: userId, isDeleted: false }, data, { new: true });
  }

  async deleteCertification(id: string, userId: string): Promise<boolean> {
    const res = await Certification.updateOne({ _id: id, user: userId }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }

  // Language CRUD
  async getLanguageList(userId: string): Promise<ILanguage[]> {
    return Language.find({ user: userId, isDeleted: false }).sort({ name: 1 });
  }

  async addLanguage(userId: string, data: Partial<ILanguage>): Promise<ILanguage> {
    return Language.create({ ...data, user: userId });
  }

  async updateLanguage(id: string, userId: string, data: Partial<ILanguage>): Promise<ILanguage | null> {
    return Language.findOneAndUpdate({ _id: id, user: userId, isDeleted: false }, data, { new: true });
  }

  async deleteLanguage(id: string, userId: string): Promise<boolean> {
    const res = await Language.updateOne({ _id: id, user: userId }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }

  // Portfolio CRUD
  async getPortfolioList(userId: string): Promise<IPortfolio[]> {
    return Portfolio.find({ user: userId, isDeleted: false }).sort({ createdAt: -1 });
  }

  async addPortfolio(userId: string, data: Partial<IPortfolio>): Promise<IPortfolio> {
    return Portfolio.create({ ...data, user: userId });
  }

  async updatePortfolio(id: string, userId: string, data: Partial<IPortfolio>): Promise<IPortfolio | null> {
    return Portfolio.findOneAndUpdate({ _id: id, user: userId, isDeleted: false }, data, { new: true });
  }

  async deletePortfolio(id: string, userId: string): Promise<boolean> {
    const res = await Portfolio.updateOne({ _id: id, user: userId }, { isDeleted: true, deletedAt: new Date() });
    return res.modifiedCount > 0;
  }

  async hasResume(userId: string): Promise<boolean> {
    const count = await Resume.countDocuments({ user: userId, isDeleted: false });
    return count > 0;
  }
}
