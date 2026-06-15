import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

// 認証が必要なパス
const PROTECTED_PATHS = [
  "/api/favorites",
  "/api/auth/user",
  "/api/auth/profile",
  "/api/auth/password",
  "/api/auth/logout",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cookieからトークンを取得
  const token = request.cookies.get("auth_token")?.value;

  // 保護されたパスでなければ、トークンがあればAuthorizationヘッダーを設定して通過
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtectedPath) {
    if (token) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("authorization", `Bearer ${token}`);
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }
    return NextResponse.next();
  }

  // 保護されたパスの場合、トークンが必須
  if (!token) {
    return NextResponse.json(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "無効なトークンです" },
      { status: 401 }
    );
  }

  // Authorizationヘッダーを設定
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("authorization", `Bearer ${token}`);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
