"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function AuthLink() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
  }, []);

  if (isLoggedIn) {
    return (
      <Link
        href="/mypage"
        className="p-2 hover:bg-white/20 rounded-full transition-colors"
        title="マイページ"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </Link>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
    >
      ログイン
    </Link>
  );
}
