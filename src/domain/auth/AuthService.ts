// Domain Service: Auth
import { User, LoginCredentials, RegisterInput } from './User';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<User>;
  register(input: RegisterInput): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
