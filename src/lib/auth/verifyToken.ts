import { auth } from "./better-auth";

type AuthResult = {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
} | null;

/**
 * Bearer tokenを検証してユーザー情報を取得
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
