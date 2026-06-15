import { headers } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { userRepository } from "@/repositories/userRepository";
import type { UserWithoutPassword } from "@/repositories/userRepository";
import type { TokenPayload } from "@/lib/types";

/**
 * AuthorizationヘッダーからBearerトークンを取得してユーザー情報を返す
 */
export async function getCurrentUser(): Promise<UserWithoutPassword | null> {
  const headersList = await headers();
  const authorization = headersList.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice(7); // "Bearer " を除去
  const payload = await verifyToken(token);

  if (!payload) {
    return null;
  }

  return userRepository.findById(payload.userId);
}

/**
 * トークンのペイロードのみを返す（DB問い合わせなし）
 */
export async function getCurrentUserFromToken(): Promise<TokenPayload | null> {
  const headersList = await headers();
  const authorization = headersList.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice(7);
  return verifyToken(token);
}

/**
 * 認証必須のサーバーサイド処理用
 * ユーザーが取得できない場合はエラーをスロー
 */
export async function requireUser(): Promise<UserWithoutPassword> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("認証が必要です");
  }
  return user;
}
