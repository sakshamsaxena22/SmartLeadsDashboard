import { Response } from 'express';

interface SuccessOptions<T> {
  res: Response;
  data: T;
  message?: string;
  statusCode?: number;
}

interface PaginatedOptions<T> {
  res: Response;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ErrorOptions {
  res: Response;
  message: string;
  statusCode?: number;
  errors?: Record<string, string>;
}

export const sendSuccess = <T>({
  res,
  data,
  message,
  statusCode = 200,
}: SuccessOptions<T>): void => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendPaginated = <T>({
  res,
  data,
  pagination,
}: PaginatedOptions<T>): void => {
  res.status(200).json({
    success: true,
    data,
    pagination,
  });
};

export const sendError = ({
  res,
  message,
  statusCode = 500,
  errors,
}: ErrorOptions): void => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
