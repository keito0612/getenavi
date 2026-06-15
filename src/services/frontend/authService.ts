import {
  frontendAuthRepository,
  type IFrontendAuthRepository,
} from "@/repositories/frontend/authRepository";
import type { AuthResponse, UserData } from "@/lib/types";

export class FrontendAuthService {
  constructor(private readonly repository: IFrontendAuthRepository) { }

  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    return this.repository.register(data);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.repository.login(email, password);
  }

  async logout(): Promise<void> {
    return this.repository.logout();
  }

  async updateProfile(data: { name: string }): Promise<UserData> {
    return this.repository.updateProfile(data);
  }

  async changePassword(
    data: { currentPassword: string; newPassword: string; confirmPassword: string }
  ): Promise<void> {
    return this.repository.changePassword(data);
  }
}

export const frontendAuthService = new FrontendAuthService(frontendAuthRepository);
