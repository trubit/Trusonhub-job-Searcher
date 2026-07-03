import jwt, { Secret } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UserRole } from '../database/models/User.js';

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  tokenVersion: number;
}

export function generateAccessToken(payload: JwtUserPayload): string {
  const secret: Secret = env.JWT_ACCESS_SECRET;
  return jwt.sign(payload, secret, {
    expiresIn: '15m',
  });
}

export function generateRefreshToken(payload: JwtUserPayload): string {
  const secret: Secret = env.JWT_REFRESH_SECRET;
  return jwt.sign(payload, secret, {
    expiresIn: '7d',
  });
}

export function verifyAccessToken(token: string): JwtUserPayload {
  const secret: Secret = env.JWT_ACCESS_SECRET;
  return jwt.verify(token, secret) as JwtUserPayload;
}

export function verifyRefreshToken(token: string): JwtUserPayload {
  const secret: Secret = env.JWT_REFRESH_SECRET;
  return jwt.verify(token, secret) as JwtUserPayload;
}
