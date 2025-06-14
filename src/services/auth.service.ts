import { UserRepository } from '../repositories/user.repository';
import { PasswordUtils } from '../utils/password.utils';
import { JwtUtils } from '../utils/jwt.utils';
import { LoginDto, RegisterDto, AuthResponse, RefreshTokenDto } from '../types/auth.types';
import { User } from '../models/user.model';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, username, profilePicture } = registerDto;

    // Check if user already exists by email
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }

    // Check if user already exists by username
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error('User with this username already exists');
    }

    // Validate password
    const passwordValidation = PasswordUtils.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Hash password
    const hashedPassword = await PasswordUtils.hash(password);

    // Create user
    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      username,
      profilePicture,
    });

    // Generate tokens
    const tokens = await this.generateTokens(newUser);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        profilePicture: newUser.profilePicture,
      },
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await PasswordUtils.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
      },
      tokens,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = refreshTokenDto;

    // Verify refresh token
    let payload;
    try {
      payload = JwtUtils.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }

    // Check if refresh token exists in database
    const storedToken = await this.userRepository.findRefreshToken(refreshToken);
    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await this.userRepository.deleteRefreshToken(refreshToken);
      throw new Error('Refresh token expired');
    }

    // Find user
    const user = await this.userRepository.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Delete old refresh token
    await this.userRepository.deleteRefreshToken(refreshToken);

    // Generate new tokens
    return this.generateTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.userRepository.deleteRefreshToken(refreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.userRepository.deleteUserRefreshTokens(userId);
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = JwtUtils.generateAccessToken(user.id, user.email);
    const refreshToken = JwtUtils.generateRefreshToken(user.id, user.email);

    // Store refresh token in database
    const expiresAt = JwtUtils.getTokenExpirationDate(refreshToken);
    await this.userRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
}