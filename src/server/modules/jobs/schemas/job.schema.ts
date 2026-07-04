import { z } from 'zod';

export const jobCreateSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    responsibilities: z.string().optional(),
    requirements: z.string().optional(),
    qualifications: z.string().optional(),
    employmentType: z.string().min(2, 'Employment type is required'),
    experienceLevel: z.enum(['ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'EXECUTIVE']),
    careerLevel: z.string().optional(),
    industry: z.string().optional(),
    department: z.string().optional(),
    salaryType: z.enum(['HOURLY', 'MONTHLY', 'YEARLY', 'COMMISSION', 'NEGOTIABLE']),
    minimumSalary: z.number().optional(),
    maximumSalary: z.number().optional(),
    currency: z.string().default('USD'),
    salaryVisibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
    country: z.string().min(2, 'Country is required'),
    state: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    remoteOption: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']),
    workplaceType: z.string().optional(),
    vacancies: z.number().int().positive().optional(),
    applicationDeadline: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    benefits: z.array(z.string()).optional(),
    requiredSkills: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    company: z.string().min(1, 'Company ID is required'),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED']).default('DRAFT'),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
  }),
});

export const jobUpdateSchema = z.object({
  body: jobCreateSchema.shape.body.partial(),
});
