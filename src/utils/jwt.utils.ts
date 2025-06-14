import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { JwtPayload } from '../types/auth.types';

export class JwtUtils {
  static generateAccessToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn }
    );
  }

  static generateRefreshToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
  }

  static verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static getTokenExpirationDate(token: string): Date {
    const decoded = jwt.decode(token) as JwtPayload;
    return new Date(decoded.exp * 1000);
  }
}