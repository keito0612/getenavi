import {
  frontendAuthRepository,
  type IFrontendAuthRepository,
  type AuthResponse,
  type UserData,
} from "@/repositories/frontend/authRepository";

export class FrontendAuthService {
  constructor(private readonly repository: IFrontendAuthRepository) {}

  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    return this.repository.register(data);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.repository.login(email, password);
  }

  async getCurrentUser(token: string): Promise<UserData> {
    return this.repository.getCurrentUser(token);
  }
}

export const frontendAuthService = new FrontendAuthService(frontendAuthRepository);
