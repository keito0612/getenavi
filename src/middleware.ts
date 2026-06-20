import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証が必要なAPIパス
const PROTECTED_API_PATHS = [
  "/api/auth/profile",
  "/api/auth/password",
  "/api/favorites",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証が必要なAPIかチェック
  const isProtectedApi = PROTECTED_API_PATHS.some((path) => pathname.startsWith(path));

  if (isProtectedApi) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
