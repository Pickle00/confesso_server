import { eq, and } from 'drizzle-orm';
import { db } from '../config/database';
import { users, refreshTokens, User, NewUser, RefreshToken, NewRefreshToken } from '../models/user.model';

export class UserRepository {
  async create(userData: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || null;
  }

  async update(id: string, userData: Partial<NewUser>): Promise<User | null> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Refresh Token methods
  async createRefreshToken(tokenData: NewRefreshToken): Promise<RefreshToken> {
    const [token] = await db.insert(refreshTokens).values(tokenData).returning();
    return token;
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    const [refreshToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token));
    return refreshToken || null;
  }

  async deleteRefreshToken(token: string): Promise<boolean> {
    const result = await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    return result.rowCount > 0;
  }

  async deleteUserRefreshTokens(userId: string): Promise<boolean> {
    const result = await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    return result.rowCount > 0;
  }

  async deleteExpiredRefreshTokens(): Promise<boolean> {
    const result = await db.delete(refreshTokens).where(
      and(eq(refreshTokens.expiresAt, new Date()))
    );
    return result.rowCount > 0;
  }
}