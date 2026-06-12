import {
  authRepository,
  type IAuthRepository,
  type UserWithoutPassword,
} from "@/repositories/authRepository";
import { UtilAuth } from "@/lib/auth";
import { EmailService } from "@/lib/email";

export class AuthService {
  constructor(private readonly repository: IAuthRepository) {}

  async register(data: { email: string; password: string; name: string }): Promise<UserWithoutPassword> {
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("このメールアドレスは既に登録されています");
    }

    const hashedPassword = await UtilAuth.hashPassword(data.password);

    const user = await this.repository.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    // 登録完了メールを送信（非同期で送信、エラーは無視）
    EmailService.sendWelcomeEmail(user.email, user.name).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    return user;
  }

  async login(email: string, password: string): Promise<UserWithoutPassword> {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new Error("メールアドレスまたはパスワードが正しくありません");
    }

    const isValid = await UtilAuth.verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error("メールアドレスまたはパスワードが正しくありません");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await UtilAuth.hashPassword(newPassword);
    await this.repository.updatePassword(userId, hashedPassword);
  }
}

export const authService = new AuthService(authRepository);
