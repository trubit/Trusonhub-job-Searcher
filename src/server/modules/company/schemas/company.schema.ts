import { z } from 'zod';

export const companySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters'),
    logoUrl: z.string().optional(),
    coverImageUrl: z.string().optional(),
    website: z.string().optional(),
    industry: z.string().min(2, 'Industry is required'),
    companySize: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).default('11-50'),
    foundedYear: z.number().optional(),
    headquarters: z.string().min(2, 'Headquarters location is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    mission: z.string().optional(),
    vision: z.string().optional(),
    culture: z.string().optional(),
    contactInfo: z
      .object({
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().optional(),
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
      })
      .optional(),
    socialLinks: z
      .object({
        linkedin: z.string().optional(),
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
        youtube: z.string().optional(),
      })
      .optional(),
    benefits: z.array(z.string()).default([]),
  }),
});
