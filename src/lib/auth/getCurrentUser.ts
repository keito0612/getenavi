import { headers } from "next/headers";
import { userRepository } from "@/repositories/userRepository";
import type { UserWithoutPassword } from "@/repositories/userRepository";

/**
 * サーバーサイドで現在のユーザーをDBから取得
 * Middlewareで設定されたヘッダーのuserIdを使用
 */
export async function getCurrentUser(): Promise<UserWithoutPassword | null> {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return null;
  }

  return userRepository.findById(userId);
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
