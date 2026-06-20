import { passwordResetRepository, type IPasswordResetRepository } from "@/repositories/passwordResetRepository";
import { authRepository, type IAuthRepository } from "@/repositories/authRepository";
import { hash } from "bcryptjs";

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

    // Better Authではパスワードはaccountsテーブルに保存される
    const account = await this.authRepo.findAccountByUserId(validToken.userId, "credential");
    if (!account) {
      return false;
    }

    const hashedPassword = await hash(newPassword, 10);
    await this.authRepo.updateAccountPassword(account.id, hashedPassword);
    await this.resetRepository.markAsUsed(token);

    return true;
  }
}

export const passwordResetService = new PasswordResetService(
  passwordResetRepository,
  authRepository
);
