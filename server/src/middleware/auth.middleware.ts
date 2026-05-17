import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { User } from '../models/User.model';
import { sendError } from '../utils/apiResponse';
import { IUserDocument } from '../models/User.model';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError({ res, message: 'Access denied. No token provided.', statusCode: 401 });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      sendError({ res, message: 'User not found. Token invalid.', statusCode: 401 });
      return;
    }

    req.user = user;
    next();
  } catch {
    sendError({ res, message: 'Invalid or expired token.', statusCode: 401 });
  }
};
