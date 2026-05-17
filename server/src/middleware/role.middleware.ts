import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../shared/types';
import { sendError } from '../utils/apiResponse';

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError({ res, message: 'Authentication required.', statusCode: 401 });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      sendError({
        res,
        message: 'You do not have permission to perform this action.',
        statusCode: 403,
      });
      return;
    }

    next();
  };
};
