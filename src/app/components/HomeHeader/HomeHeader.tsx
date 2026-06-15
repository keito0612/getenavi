"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuthCookieClient } from "@/lib/cookie";
import { frontendUserService } from "@/services/frontend";
import { UserData } from "@/lib/types";
import HeaderLink from "./HeaderLink";

const navigation = [
  { name: "検索", href: "/" },
  { name: "ログイン", href: "/auth/login" },
  { name: "新規登録", href: "/auth/register" },
  { name: "お気に入り", href: "/favorites" },
  { name: "設定", href: "/mypage" },
];

const HeaderNavigation = ({ navigations }: { navigations: { name: string; href: string }[] }) => {
  return (
    <div className="flex items-center gap-2">
      {navigations.map((item) => (
        <HeaderLink key={item.href} name={item.name} href={item.href} />
      ))}
    </div>
  );
};

const HeaderLogo = () => {
  return (
    <Link href={'/'}>
      <h1 className="text-xl font-bold">ゲテナビ</h1>
    </Link>
  );
};

const HeaderUser = ({ user }: { user: UserData | null }) => {
  if (!user) return null;

  return (
    <Link
      href="/mypage"
      className="size-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
    >
      <svg
        className="size-5 text-amber-600"
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


const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-amber-600 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {children}
      </div>
    </header >
  );
}

export function HomeHeader() {
  const [filteredNavigation, setFilteredNavigation] = useState(navigation);
  const [user, setUser] = useState<UserData | null>(null);
  const getUser = async () => {
    try {
      const user = await frontendUserService.getCurrentUser();
      setUser(user);
    } catch (e) {
      setUser(null);
    }
  }

  useEffect(() => {
    const token = getAuthCookieClient();
    if (token) {
      setFilteredNavigation(
        navigation.filter(
          (item) => item.name !== "ログイン" && item.name !== "新規登録"
        )
      );
      getUser();
    } else {
      setFilteredNavigation(navigation);
    }
  }, []);

  return (
    <Header>
      <HeaderLogo />
      <div className="flex items-center gap-3">
        <HeaderNavigation navigations={filteredNavigation} />
        <HeaderUser user={user} />
      </div>
    </Header>
  );
}
