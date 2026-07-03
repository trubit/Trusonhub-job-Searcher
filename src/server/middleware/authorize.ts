import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../database/models/User.js';
import { AppError } from '../utils/AppError.js';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access forbidden: required role [${allowedRoles.join(', ')}], your role [${req.user.role}]`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
}
