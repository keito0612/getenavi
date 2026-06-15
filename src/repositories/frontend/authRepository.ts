import type { UserData, AuthResponse } from "@/lib/types";
import { AuthError } from "@/lib/errors";

export { AuthError };

export interface IFrontendAuthRepository {
  register(data: { email: string; password: string; name: string }): Promise<AuthResponse>;
  login(email: string, password: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  updateProfile(data: { name: string }): Promise<UserData>;
  changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<void>;
}

export class FrontendAuthRepository implements IFrontendAuthRepository {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/auth") {
    this.baseUrl = baseUrl;
  }

  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new AuthError(result.error || "登録に失敗しました", response.status);
    }

    return { user: result.user, token: result.token };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new AuthError(result.error || "ログインに失敗しました", response.status);
    }

    return { user: result.user, token: result.token };
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const result = await response.json();
      throw new AuthError(result.error || "ログアウトに失敗しました", response.status);
    }
  }

  async updateProfile(data: { name: string }): Promise<UserData> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new AuthError(result.error || "プロフィールの更新に失敗しました", response.status);
    }

    return result.user;
  }

  async changePassword(
    data: { currentPassword: string; newPassword: string; confirmPassword: string }
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new AuthError(result.error || "パスワードの変更に失敗しました", response.status);
    }
  }
}

export const frontendAuthRepository = new FrontendAuthRepository();
