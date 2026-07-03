import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { User, IUser } from '../database/models/User.js';
import { AppError } from '../utils/AppError.js';

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace Express {
    interface Request {
      user?: IUser;
      tokenPayload?: unknown;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401, 'UNAUTHORIZED');
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select('+passwordHash');
    if (!user || user.isDeleted || user.status !== 'ACTIVE') {
      throw new AppError('User session invalid or account inactive.', 401, 'UNAUTHORIZED');
    }

    // Check if token version was revoked/incremented
    if (decoded.tokenVersion !== user.refreshTokenVersion) {
      throw new AppError('Session expired. Please log in again.', 401, 'UNAUTHORIZED');
    }

    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Invalid or expired authentication token.', 401, 'UNAUTHORIZED'));
  }
}
