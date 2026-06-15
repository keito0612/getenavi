import { NextResponse } from "next/server";
import {
  authRepository,
  type IAuthRepository,
} from "@/repositories/authRepository";
import { UtilAuth, setAuthCookie, clearAuthCookie } from "@/lib/auth";
import { EmailService } from "@/lib/email";
import { createToken } from "@/lib/auth/jwt";
import { getCurrentUser } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/passwordReset";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validations/profile";
import { ApiResponse } from "@/lib/api";
import { passwordResetService } from "@/services/passwordResetService";

export class AuthService {
  constructor(private readonly repository: IAuthRepository) { }

  async register(body: unknown): Promise<NextResponse> {
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return ApiResponse.validationError(result.error);
    }
    try {
      const existingUser = await this.repository.findByEmail(result.data.email);
      if (existingUser) {
        return ApiResponse.error("このメールアドレスは既に登録されています");
      }

      const hashedPassword = await UtilAuth.hashPassword(result.data.password);
      const user = await this.repository.createUser({
        email: result.data.email,
        password: hashedPassword,
        name: result.data.name,
      });

      EmailService.sendWelcomeEmail(user.email, user.name).catch((error) => {
        console.error("Failed to send welcome email:", error);
      });

      const token = await createToken({ userId: user.id, email: user.email });
      const response = NextResponse.json({ user }, { status: 201 });
      return setAuthCookie(response, token);
    } catch (error) {
      console.error("Error registering user:", error);
      return ApiResponse.serverError();
    }
  }

  async login(body: unknown): Promise<NextResponse> {
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return ApiResponse.validationError(result.error);
    }
    try {
      const user = await this.repository.findByEmail(result.data.email);
      if (!user) {
        return ApiResponse.unauthorized("メールアドレスまたはパスワードが正しくありません");
      }

      const isValid = await UtilAuth.verifyPassword(result.data.password, user.password);
      if (!isValid) {
        return ApiResponse.unauthorized("メールアドレスまたはパスワードが正しくありません");
      }

      const token = await createToken({ userId: user.id, email: user.email });
      const response = NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
      return setAuthCookie(response, token);
    } catch (error) {
      console.error("Error logging in:", error);
      return ApiResponse.serverError();
    }
  }

  async logout(): Promise<NextResponse> {
    const response = NextResponse.json({ message: "ログアウトしました" });
    return clearAuthCookie(response);
  }

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

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await UtilAuth.hashPassword(newPassword);
    await this.repository.updatePassword(userId, hashedPassword);
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
      const user = await this.repository.findById(userId);
      if (!user) {
        return ApiResponse.unauthorized();
      }

      const isValid = await UtilAuth.verifyPassword(result.data.currentPassword, user.password);
      if (!isValid) {
        return ApiResponse.error("現在のパスワードが正しくありません");
      }

      await this.updatePassword(userId, result.data.newPassword);
      return ApiResponse.success({ message: "パスワードを変更しました" });
    } catch (error) {
      console.error("Error changing password:", error);
      return ApiResponse.serverError("パスワードの変更に失敗しました");
    }
  }
}

export const authService = new AuthService(authRepository);
