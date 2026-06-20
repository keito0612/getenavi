import type { UserData } from "@/lib/types";
import { AuthError } from "@/lib/errors";
import { authFetch } from "@/lib/authFetch";

export class FrontendAuthService {
  private baseUrl = "/api/auth";

  async updateProfile(data: { name: string }): Promise<UserData> {
    const response = await authFetch(`${this.baseUrl}/profile`, {
      method: "PATCH",
      body: JSON.stringify(data),
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
    const response = await authFetch(`${this.baseUrl}/password`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new AuthError(result.error || "パスワードの変更に失敗しました", response.status);
    }
  }
}

export const frontendAuthService = new FrontendAuthService();
