import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

// 認証が必要なパス
const PROTECTED_PATHS = ["/api/favorites", "/api/auth/user"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 保護されたパスでなければスキップ
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Authorizationヘッダーからトークンを取得
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "無効なトークンです" },
      { status: 401 }
    );
  }

  // リクエストヘッダーにユーザー情報を追加
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-email", payload.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
