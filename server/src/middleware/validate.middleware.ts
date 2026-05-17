import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/apiResponse';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, target: ValidationTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join('.');
        fieldErrors[field] = issue.message;
      });

      sendError({
        res,
        message: 'Validation failed',
        statusCode: 400,
        errors: fieldErrors,
      });
      return;
    }

    req[target] = result.data;
    next();
  };
};
