import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../database/models/User.js';

export async function authenticateOptional(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);
    if (user && !user.isDeleted && user.status === 'ACTIVE' && decoded.tokenVersion === user.refreshTokenVersion) {
      req.user = user;
      req.tokenPayload = decoded;
    }
  } catch {
    // Ignore error for optional authentication
  }
  next();
}
