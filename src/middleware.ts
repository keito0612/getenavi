import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_API_PATHS = [
  "/api/auth/name",
  "/api/auth/password",
  "/api/favorites",
  "/api/profile",
  "/api/restaurants/", // reviews POST/PATCH/DELETE用（GETは除外）
];

// 認証不要なパス（PROTECTEDの中でも例外）
const PUBLIC_API_METHODS: Record<string, string[]> = {
  "/api/restaurants/": ["GET"], // レビュー一覧はGETのみ認証不要
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const isProtectedApi = PROTECTED_API_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtectedApi) {
    return NextResponse.next();
  }

  // 認証不要なメソッドかチェック
  const publicMethods = Object.entries(PUBLIC_API_METHODS).find(([path]) =>
    pathname.startsWith(path)
  );
  if (publicMethods && publicMethods[1].includes(method)) {
    return NextResponse.next();
  }

  // Bearer tokenの存在チェックのみ（実際の検証はAPIルートで行う）
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // トークンが存在する場合は次の処理へ（実際の検証はAPIルートで行う）
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
