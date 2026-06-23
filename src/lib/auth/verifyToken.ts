import { auth } from "./better-auth";
import type { AuthResult } from "@/lib/types";

/**
 * 認証情報を検証してユーザー情報を取得
 * Cookie認証とBearer token認証の両方に対応
 */
export async function verifyBearerToken(headers: Headers): Promise<AuthResult> {
  const result = await auth.api.getSession({ headers });

  if (!result?.user) {
    return null;
  }

  return {
    userId: result.user.id,
    user: result.user,
  };
}
