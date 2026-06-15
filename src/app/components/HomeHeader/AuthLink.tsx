"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { frontendUserService } from "@/services/frontend";

export function AuthLink() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    frontendUserService
      .getCurrentUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, [pathname]);

  if (isLoggedIn === null) {
    return <div className="w-16 h-8" />;
  }

  if (isLoggedIn) {
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
