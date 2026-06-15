import { passwordResetRepository, type IPasswordResetRepository } from "@/repositories/passwordResetRepository";
import { authRepository, type IAuthRepository } from "@/repositories/authRepository";
import { authService } from "@/services/authService";

export class PasswordResetService {
  constructor(
    private readonly resetRepository: IPasswordResetRepository,
    private readonly authRepo: IAuthRepository
  ) {}

  async requestPasswordReset(email: string): Promise<string | null> {
    const user = await this.authRepo.findByEmail(email);
    if (!user) {
      // セキュリティ: ユーザーが存在しない場合もエラーを返さない
      return null;
    }

    const token = await this.resetRepository.createToken(user.id);
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const validToken = await this.resetRepository.findValidToken(token);
    if (!validToken) {
      return false;
    }

    await authService.updatePassword(validToken.userId, newPassword);
    await this.resetRepository.markAsUsed(token);

    return true;
  }
}

export const passwordResetService = new PasswordResetService(
  passwordResetRepository,
  authRepository
);
