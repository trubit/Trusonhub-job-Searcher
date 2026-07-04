import { JobCategory } from './models/JobCategory.js';
import { JobType } from './models/JobType.js';
import { logger } from '../utils/logger.js';

export async function seedDatabase(): Promise<void> {
  try {
    // 1. Seed Job Categories
    const categoriesCount = await JobCategory.countDocuments({ isDeleted: false });
    if (categoriesCount === 0) {
      const defaultCategories = [
        { name: 'Software Development', slug: 'software-development', description: 'Software engineering, web/mobile development, devops, database administration.' },
        { name: 'Marketing', slug: 'marketing', description: 'Digital marketing, SEO, social media management, brand strategy.' },
        { name: 'Finance', slug: 'finance', description: 'Accounting, auditing, financial analyst, wealth management.' },
        { name: 'Healthcare', slug: 'healthcare', description: 'Medicine, nursing, medical research, pharmaceutical operations.' },
        { name: 'Sales', slug: 'sales', description: 'Account executive, sales representative, business development.' },
        { name: 'Education', slug: 'education', description: 'Teaching, academic research, administration.' },
        { name: 'Customer Support', slug: 'customer-support', description: 'Client success, technical support, call center services.' },
      ];
      await JobCategory.insertMany(defaultCategories);
      logger.info('✅ Seeded default job categories');
    }

    // 2. Seed Job Types
    const typesCount = await JobType.countDocuments({ isDeleted: false });
    if (typesCount === 0) {
      const defaultTypes = [
        { name: 'Full-Time', slug: 'full-time' },
        { name: 'Part-Time', slug: 'part-time' },
        { name: 'Contract', slug: 'contract' },
        { name: 'Internship', slug: 'internship' },
        { name: 'Freelance', slug: 'freelance' },
        { name: 'Temporary', slug: 'temporary' },
      ];
      await JobType.insertMany(defaultTypes);
      logger.info('✅ Seeded default job types');
    }
  } catch (error) {
    logger.error('❌ Failed to seed database:', { error });
  }
}
