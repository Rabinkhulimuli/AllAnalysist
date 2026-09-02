import { IAuthService } from '@/src/domain/auth/AuthService';
import { LoginCredentials, RegisterInput, User } from '@/src/domain/auth/User';

/**
 * Mock implementation of AuthService
 * Replace with actual database/API calls
 */
export class AuthRepository implements IAuthService {
  private users: Map<string, User> = new Map();

  async login(credentials: LoginCredentials): Promise<User> {
    // TODO: Implement actual authentication
    const user = Array.from(this.users.values()).find(u => u.email === credentials.email);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async register(input: RegisterInput): Promise<User> {
    const user: User = {
      id: Date.now().toString(),
      email: input.email,
      name: input.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async logout(): Promise<void> {
    // TODO: Implement logout logic
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Implement get current user
    return null;
  }
}

export const authRepository = new AuthRepository();
