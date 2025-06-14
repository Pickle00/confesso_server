import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ResponseUtils } from '../utils/response.utils';
import { LoginDto, RegisterDto, RefreshTokenDto } from '../types/auth.types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const registerDto: RegisterDto = req.body;
      
      // Basic validation
      if (!registerDto.email || !registerDto.password || !registerDto.username) {
        return ResponseUtils.error(res, 'Email, password, and username are required', 400);
      }

      const result = await this.authService.register(registerDto);
      
      return ResponseUtils.success(
        res,
        'User registered successfully',
        result,
        201
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return ResponseUtils.error(res, message, 400);
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const loginDto: LoginDto = req.body;
      
      // Basic validation
      if (!loginDto.email || !loginDto.password) {
        return ResponseUtils.error(res, 'Email and password are required', 400);
      }

      const result = await this.authService.login(loginDto);
      
      return ResponseUtils.success(
        res,
        'Login successful',
        result
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return ResponseUtils.error(res, message, 401);
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const refreshTokenDto: RefreshTokenDto = req.body;
      
      if (!refreshTokenDto.refreshToken) {
        return ResponseUtils.error(res, 'Refresh token is required', 400);
      }

      const result = await this.authService.refreshTokens(refreshTokenDto);
      
      return ResponseUtils.success(
        res,
        'Tokens refreshed successfully',
        result
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token refresh failed';
      return ResponseUtils.error(res, message, 401);
    }
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return ResponseUtils.error(res, 'Refresh token is required', 400);
      }

      await this.authService.logout(refreshToken);
      
      return ResponseUtils.success(
        res,
        'Logout successful'
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      return ResponseUtils.error(res, message, 400);
    }
  };

  logoutAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return ResponseUtils.error(res, 'User not authenticated', 401);
      }

      await this.authService.logoutAll(userId);
      
      return ResponseUtils.success(
        res,
        'Logged out from all devices successfully'
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout all failed';
      return ResponseUtils.error(res, message, 400);
    }
  };

  getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return ResponseUtils.error(res, 'User not authenticated', 401);
      }

      const user = await this.authService.getCurrentUser(userId);
      
      if (!user) {
        return ResponseUtils.error(res, 'User not found', 404);
      }

      // Remove password from response
      const { password, ...userResponse } = user;
      
      return ResponseUtils.success(
        res,
        'User retrieved successfully',
        userResponse
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user';
      return ResponseUtils.error(res, message, 400);
    }
  };
}