import { NextRequest, NextResponse } from "next/server";
import { authRepository, type IAuthRepository } from "@/repositories/authRepository";
import { EmailService } from "@/services/emailService";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/passwordReset";
import { updateNameSchema, changePasswordSchema } from "@/lib/validations/profile";
import { ApiResponse } from "@/lib/api";
import { passwordResetService } from "@/services/passwordResetService";
import { verifyBearerToken } from "@/lib/auth/verifyToken";
import { compare, hash } from "bcryptjs";

export class AuthService {
  constructor(private readonly repository: IAuthRepository) { }

  async forgotPassword(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const result = forgotPasswordSchema.safeParse(body);
      if (!result.success) {
        return ApiResponse.validationError(result.error);
      }

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

  async resetPassword(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const result = resetPasswordSchema.safeParse(body);
      if (!result.success) {
        return ApiResponse.validationError(result.error);
      }
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

  async updateName(request: NextRequest): Promise<NextResponse> {
    const auth = await verifyBearerToken(request.headers);
    if (!auth) {
      return ApiResponse.unauthorized();
    }

    try {
      const body = await request.json();
      const result = updateNameSchema.safeParse(body);
      if (!result.success) {
        return ApiResponse.validationError(result.error);
      }

      const user = await this.repository.updateName(auth.userId, result.data.name);
      return ApiResponse.success({ user });
    } catch (error) {
      console.error("Error updating name:", error);
      return ApiResponse.serverError("名前の更新に失敗しました");
    }
  }

  async changePassword(request: NextRequest): Promise<NextResponse> {
    const auth = await verifyBearerToken(request.headers);
    if (!auth) {
      return ApiResponse.unauthorized();
    }

    try {
      const body = await request.json();
      const result = changePasswordSchema.safeParse(body);
      if (!result.success) {
        return ApiResponse.validationError(result.error);
      }

      const account = await this.repository.findAccountByUserId(auth.userId, "credential");

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
