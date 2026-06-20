import { NextResponse } from "next/server";
import { authRepository, type IAuthRepository } from "@/repositories/authRepository";
import { EmailService } from "@/services/emailService";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/passwordReset";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validations/profile";
import { ApiResponse } from "@/lib/api";
import { passwordResetService } from "@/services/passwordResetService";
import { compare, hash } from "bcryptjs";

export class AuthService {
  constructor(private readonly repository: IAuthRepository) {}

  async forgotPassword(body: unknown): Promise<NextResponse> {
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return ApiResponse.validationError(result.error);
    }
    try {
      const token = await passwordResetService.requestPasswordReset(result.data.email);
      if (token) {
        EmailService.sendPasswordResetEmail(result.data.email, token).catch((error) => {
          console.error("Failed to send password reset email:", error);
        });
      }
      return ApiResponse.success({
        message: "メールアドレスが登録されている場合、パスワードリセット用のメールを送信しました",
      });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      return ApiResponse.serverError("パスワードリセットのリクエストに失敗しました");
    }
  }

  async resetPassword(body: unknown): Promise<NextResponse> {
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return ApiResponse.validationError(result.error);
    }
    try {
      const success = await passwordResetService.resetPassword(
        result.data.token,
        result.data.password
      );
      if (!success) {
        return ApiResponse.error("無効または期限切れのトークンです");
      }
      return ApiResponse.success({ message: "パスワードが正常にリセットされました" });
    } catch (error) {
      console.error("Error resetting password:", error);
      return ApiResponse.serverError("パスワードのリセットに失敗しました");
    }
  }

  async updateProfile(userId: string, body: unknown): Promise<NextResponse> {
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return ApiResponse.validationError(result.error);
    }

    try {
      const user = await this.repository.updateProfile(userId, { name: result.data.name });
      return ApiResponse.success({ user });
    } catch (error) {
      console.error("Error updating profile:", error);
      return ApiResponse.serverError("プロフィールの更新に失敗しました");
    }
  }

  async changePassword(userId: string, body: unknown): Promise<NextResponse> {
    const result = changePasswordSchema.safeParse(body);
    if (!result.success) {
      return ApiResponse.validationError(result.error);
    }

    try {
      const account = await this.repository.findAccountByUserId(userId, "credential");

      if (!account?.password) {
        return ApiResponse.error("パスワードが設定されていません");
      }

      const isValid = await compare(result.data.currentPassword, account.password);
      if (!isValid) {
        return ApiResponse.error("現在のパスワードが正しくありません");
      }

      const hashedPassword = await hash(result.data.newPassword, 10);
      await this.repository.updateAccountPassword(account.id, hashedPassword);

      return ApiResponse.success({ message: "パスワードを変更しました" });
    } catch (error) {
      console.error("Error changing password:", error);
      return ApiResponse.serverError("パスワードの変更に失敗しました");
    }
  }
}

export const authService = new AuthService(authRepository);
