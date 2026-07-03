import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, hashToken, generateRandomToken } from '../../../src/server/utils/hash';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../../src/server/utils/jwt';
import { registerJobSeekerSchema, loginSchema } from '../../../src/server/modules/auth/schemas/auth.schema';

describe('Server Authentication Utilities & Schemas', () => {
  describe('Password & Token Hashing', () => {
    it('hashes passwords and verifies correctly', async () => {
      const password = 'SecretPassword123!';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(await comparePassword(password, hash)).toBe(true);
      expect(await comparePassword('WrongPassword', hash)).toBe(false);
    });

    it('generates random hex tokens and computes sha256 hashes', () => {
      const token1 = generateRandomToken();
      const token2 = generateRandomToken();

      expect(token1).toHaveLength(64);
      expect(token1).not.toBe(token2);

      const hash1 = hashToken(token1);
      const hash2 = hashToken(token1);
      expect(hash1).toBe(hash2);
    });
  });

  describe('JWT Token Helper Functions', () => {
    const payload = {
      userId: 'user-123',
      email: 'user@trusonhub.com',
      role: 'JOB_SEEKER' as const,
      tokenVersion: 1,
    };

    it('generates and verifies 15-minute access tokens', () => {
      const accessToken = generateAccessToken(payload);
      expect(typeof accessToken).toBe('string');

      const decoded = verifyAccessToken(accessToken);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    it('generates and verifies 7-day refresh tokens', () => {
      const refreshToken = generateRefreshToken(payload);
      expect(typeof refreshToken).toBe('string');

      const decoded = verifyRefreshToken(refreshToken);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.tokenVersion).toBe(payload.tokenVersion);
    });
  });

  describe('Zod Auth Request Validation Schemas', () => {
    it('validates valid Job Seeker registration input', () => {
      const validInput = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'Password123!',
        },
      };

      const result = registerJobSeekerSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('rejects weak passwords failing complexity rules', () => {
      const invalidInput = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'weak',
        },
      };

      const result = registerJobSeekerSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('validates login schema correctly', () => {
      const validLogin = {
        body: {
          emailOrUsername: 'johndoe',
          password: 'Password123!',
        },
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });
  });
});
