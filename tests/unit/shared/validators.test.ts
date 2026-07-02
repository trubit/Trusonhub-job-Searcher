import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  passwordSchema,
  loginSchema,
  registerSchema,
  paginationSchema,
  mongoIdSchema,
} from '../../../src/shared/validators/common';

describe('emailSchema', () => {
  it('accepts a valid email', () => {
    const result = emailSchema.safeParse('user@example.com');
    expect(result.success).toBe(true);
  });

  it('lowercases the email', () => {
    const result = emailSchema.safeParse('USER@EXAMPLE.COM');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('user@example.com');
  });

  it('rejects an invalid email', () => {
    const result = emailSchema.safeParse('not-an-email');
    expect(result.success).toBe(false);
  });

  it('rejects an empty string', () => {
    const result = emailSchema.safeParse('');
    expect(result.success).toBe(false);
  });
});

describe('passwordSchema', () => {
  it('accepts a strong password', () => {
    const result = passwordSchema.safeParse('SecurePass123');
    expect(result.success).toBe(true);
  });

  it('rejects passwords shorter than 8 characters', () => {
    const result = passwordSchema.safeParse('Ab1');
    expect(result.success).toBe(false);
  });

  it('rejects passwords without uppercase', () => {
    const result = passwordSchema.safeParse('securepass123');
    expect(result.success).toBe(false);
  });

  it('rejects passwords without a number', () => {
    const result = passwordSchema.safeParse('SecurePassword');
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('validates correct login credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'anypassword' });
    expect(result.success).toBe(true);
  });

  it('fails without email', () => {
    const result = loginSchema.safeParse({ password: 'anypassword' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validData = {
    email: 'newuser@example.com',
    password: 'StrongPass1',
    confirmPassword: 'StrongPass1',
    firstName: 'John',
    lastName: 'Doe',
  };

  it('validates correct registration data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({ ...validData, confirmPassword: 'Different1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('confirmPassword');
    }
  });
});

describe('paginationSchema', () => {
  it('applies defaults when no values are provided', () => {
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.sortOrder).toBe('desc');
    }
  });

  it('coerces string numbers to integers', () => {
    const result = paginationSchema.safeParse({ page: '3', limit: '50' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(50);
    }
  });

  it('rejects limit over 100', () => {
    const result = paginationSchema.safeParse({ limit: 200 });
    expect(result.success).toBe(false);
  });
});

describe('mongoIdSchema', () => {
  it('accepts a valid 24-char hex ID', () => {
    const result = mongoIdSchema.safeParse('507f1f77bcf86cd799439011');
    expect(result.success).toBe(true);
  });

  it('rejects an invalid ID', () => {
    const result = mongoIdSchema.safeParse('invalid-id');
    expect(result.success).toBe(false);
  });
});
