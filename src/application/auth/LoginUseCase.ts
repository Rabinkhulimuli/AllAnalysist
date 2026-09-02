// Application: Login Use Case

import { IAuthService } from '@/src/domain/auth/AuthService';
import { LoginCredentials, User } from '@/src/domain/auth/User';

export class LoginUseCase {
  constructor(private authService: IAuthService) {}

  async execute(credentials: LoginCredentials): Promise<User> {
    // Business logic here
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Sanitize email
    const email = credentials.email.toLowerCase().trim();

    return this.authService.login({
      email,
      password: credentials.password,
    });
  }
}
