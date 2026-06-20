"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function AuthLink() {
  const { isAuthenticated, isPending } = useAuth();

  if (isPending) {
    return <div className="w-16 h-8" />;
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/mypage"
        className="text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
      >
        マイページ
      </Link>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
    >
      ログイン
    </Link>
  );
}
