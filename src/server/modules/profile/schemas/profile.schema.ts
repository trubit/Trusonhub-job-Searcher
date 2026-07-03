import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    headline: z.string().optional(),
    about: z.string().optional(),
    phoneNumber: z.string().optional(),
    location: z
      .object({
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
      })
      .optional(),
    currentPosition: z.string().optional(),
    yearsOfExperience: z.number().min(0).optional(),
    industry: z.string().optional(),
    employmentStatus: z.enum(['EMPLOYED', 'UNEMPLOYED', 'OPEN_TO_WORK', 'FREELANCING']).optional(),
    preferredJobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'ANY']).optional(),
    preferredWorkMode: z.enum(['REMOTE', 'HYBRID', 'ON_SITE', 'ANY']).optional(),
    expectedSalary: z.string().optional(),
    socialLinks: z
      .object({
        portfolio: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        behance: z.string().optional(),
        dribbble: z.string().optional(),
        personal: z.string().optional(),
      })
      .optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    position: z.string().optional(),
    department: z.string().optional(),
    businessEmail: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
  }),
});

export const educationSchema = z.object({
  body: z.object({
    institution: z.string().min(2, 'Institution name is required'),
    degree: z.string().min(1, 'Degree is required'),
    fieldOfStudy: z.string().min(1, 'Field of study is required'),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()).optional(),
    isCurrent: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

export const experienceSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position title is required'),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP']).default('FULL_TIME'),
    location: z.string().optional(),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()).optional(),
    isCurrent: z.boolean().default(false),
    responsibilities: z.string().optional(),
    achievements: z.string().optional(),
  }),
});

export const skillSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Skill name is required'),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).default('INTERMEDIATE'),
    yearsOfExperience: z.number().min(0).default(1),
  }),
});

export const certificationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Certification name is required'),
    organization: z.string().min(1, 'Organization is required'),
    issueDate: z.string().or(z.date()),
    expirationDate: z.string().or(z.date()).optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.string().optional(),
  }),
});

export const languageSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Language name is required'),
    proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'FLUENT', 'NATIVE']).default('INTERMEDIATE'),
  }),
});

export const portfolioSchema = z.object({
  body: z.object({
    projectName: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Project description is required'),
    technologies: z.array(z.string()).default([]),
    projectUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    images: z.array(z.string()).default([]),
  }),
});
