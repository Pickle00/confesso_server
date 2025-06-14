import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/response.utils';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return ResponseUtils.error(res, 'Validation error', 400, error.message);
  }

  if (error.name === 'JsonWebTokenError') {
    return ResponseUtils.error(res, 'Invalid token', 401, error.message);
  }

  if (error.name === 'TokenExpiredError') {
    return ResponseUtils.error(res, 'Token expired', 401, error.message);
  }

  // Default error response
  return ResponseUtils.error(
    res,
    'Internal server error',
    500,
    process.env.NODE_ENV === 'development' ? error.message : undefined
  );
};