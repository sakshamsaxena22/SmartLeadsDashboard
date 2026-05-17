import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { sendError } from '../utils/apiResponse';
import { env } from '../config/env';
import mongoose from 'mongoose';

interface MongoError extends Error {
  code?: number;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error({ err }, 'Unhandled error');

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string> = {};
    Object.entries(err.errors).forEach(([field, error]) => {
      errors[field] = error.message;
    });
    sendError({ res, message: 'Validation failed', statusCode: 400, errors });
    return;
  }

  // Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as MongoError).code === 11000) {
    sendError({ res, message: 'A record with this value already exists.', statusCode: 409 });
    return;
  }

  // Mongoose cast error (bad ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    sendError({ res, message: `Invalid ${err.path}: ${String(err.value)}`, statusCode: 400 });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    sendError({ res, message: 'Invalid or expired token.', statusCode: 401 });
    return;
  }

  // AppError with statusCode
  const appErr = err as MongoError & { statusCode?: number };
  const statusCode = appErr.statusCode || 500;
  const message =
    env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message;

  sendError({ res, message, statusCode });
};
