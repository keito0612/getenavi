import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_API_PATHS = [
  "/api/auth/name",
  "/api/auth/password",
  "/api/favorites",
  "/api/profile",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedApi = PROTECTED_API_PATHS.some((path) => pathname.startsWith(path));

  if (isProtectedApi) {
    // Bearer tokenまたはCookieの存在チェックのみ（実際の検証はサービス層で行う）
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
