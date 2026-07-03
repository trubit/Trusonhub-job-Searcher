import { z } from 'zod';

const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;

export const registerJobSeekerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
    username: z.string().min(3, 'Username must be at least 3 characters').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    password: z.string().regex(passwordComplexityRegex, 'Password must be 8+ chars with uppercase, lowercase, number, and special character'),
    phoneNumber: z.string().optional(),
  }),
});

export const registerEmployerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().email(),
    password: z.string().regex(passwordComplexityRegex),
    companyName: z.string().min(2, 'Company name is required for employer registration'),
    phoneNumber: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    emailOrUsername: z.string().min(1, 'Email or username is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Verification token is required'),
  }),
});

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    newPassword: z.string().regex(passwordComplexityRegex),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().regex(passwordComplexityRegex),
  }),
});
