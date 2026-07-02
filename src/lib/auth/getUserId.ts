import type { NextRequest } from "next/server";
import { auth } from "./better-auth";

/**
 * リクエストからユーザーIDを取得
 * Bearer tokenを検証してユーザーIDを返す
 */
export async function getUserId(request: NextRequest): Promise<string> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      throw new Error("Invalid session");
    }

    return session.user.id;
  } catch {
    throw new Error("Authentication failed");
  }
}
