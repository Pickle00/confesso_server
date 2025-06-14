import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/response.utils';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, username, profilePicture } = req.body;

  // Check required fields
  if (!email || !password || !username) {
    return ResponseUtils.error(res, 'Email, password, and username are required', 400);
  }

  // Validate email format
  if (!validateEmail(email)) {
    return ResponseUtils.error(res, 'Invalid email format', 400);
  }

  // Validate password length
  if (password.length < 8) {
    return ResponseUtils.error(res, 'Password must be at least 8 characters long', 400);
  }

  // Validate username
  if (typeof username !== 'string' || username.length < 3 || username.length > 50) {
    return ResponseUtils.error(res, 'Username must be between 3 and 50 characters', 400);
  }

  // Validate username format (alphanumeric and underscores only)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return ResponseUtils.error(res, 'Username can only contain letters, numbers, and underscores', 400);
  }

  // Validate profile picture URL if provided
  if (profilePicture && typeof profilePicture !== 'string') {
    return ResponseUtils.error(res, 'Profile picture must be a valid URL string', 400);
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return ResponseUtils.error(res, 'Email and password are required', 400);
  }

  // Validate email format
  if (!validateEmail(email)) {
    return ResponseUtils.error(res, 'Invalid email format', 400);
  }

  next();
};