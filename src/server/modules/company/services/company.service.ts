import { Types } from 'mongoose';
import { CompanyRepository } from '../repositories/company.repository.js';
import { ICompany } from '../../../database/models/Company.js';
import { AppError } from '../../../utils/AppError.js';
import { cloudinaryService } from '../../../services/cloudinaryService.js';

export class CompanyService {
  private repo = new CompanyRepository();

  private generateSlug(name: string): string {
    return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
  }

  async createCompany(ownerId: string, data: Partial<ICompany>) {
    const slug = this.generateSlug(data.name || 'company');
    return this.repo.createCompany({
      ...data,
      owner: new Types.ObjectId(ownerId),
      slug,
    });
  }

  async getMyCompanies(ownerId: string) {
    return this.repo.findByOwner(ownerId);
  }

  async getCompanyByIdOrSlug(identifier: string) {
    let company = await this.repo.findBySlug(identifier);
    if (!company) {
      company = await this.repo.findById(identifier);
    }
    if (!company) {
      throw new AppError('Company profile not found', 404, 'COMPANY_NOT_FOUND');
    }
    return company;
  }

  async updateCompany(id: string, ownerId: string, data: Partial<ICompany>) {
    const company = await this.repo.updateCompany(id, ownerId, data);
    if (!company) {
      throw new AppError('Company not found or unauthorized', 404, 'NOT_FOUND');
    }
    return company;
  }

  async deleteCompany(id: string, ownerId: string) {
    const deleted = await this.repo.deleteCompany(id, ownerId);
    if (!deleted) {
      throw new AppError('Company not found or unauthorized', 404, 'NOT_FOUND');
    }
  }

  async addGalleryImage(id: string, ownerId: string, fileBuffer: Buffer) {
    const company = await this.repo.findById(id);
    if (!company || company.owner.toString() !== ownerId) {
      throw new AppError('Company not found or unauthorized', 404, 'NOT_FOUND');
    }

    const { url, publicId } = await cloudinaryService.uploadImage(fileBuffer, 'company_gallery');
    company.gallery.push({
      url,
      publicId,
      sortOrder: company.gallery.length,
    });
    await company.save();
    return company;
  }

  async deleteGalleryImage(id: string, ownerId: string, publicId: string) {
    const company = await this.repo.findById(id);
    if (!company || company.owner.toString() !== ownerId) {
      throw new AppError('Company not found or unauthorized', 404, 'NOT_FOUND');
    }

    await cloudinaryService.deleteAsset(publicId);
    company.gallery = company.gallery.filter((g) => g.publicId !== publicId);
    await company.save();
    return company;
  }

  async getAllCompanies() {
    return this.repo.findAll();
  }
}
