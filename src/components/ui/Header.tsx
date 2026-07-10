"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoPersonOutline } from "react-icons/io5";
import { useAuth } from "@/hooks/useAuth";
import { AuthUser } from "@/lib/types";
import Image from 'next/image'

type Props = {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
};

const navigation = [
  { name: "検索", href: "/" },
  { name: "ログイン", href: "/auth/login" },
  { name: "新規登録", href: "/auth/register" },
  { name: "お気に入り", href: "/favorites" },
  { name: "設定", href: "/mypage" },
];

// デスクトップ用ナビゲーションリンク
function HeaderLink({ name, href }: { name: string; href: string }) {
  const pathname = usePathname();
  const isCurrent = pathname === href;
  return (
    <Link
      href={href}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${isCurrent
        ? "bg-white text-amber-600"
        : "text-gray-300 hover:bg-white hover:text-amber-600"
        }`}
    >
      {name}
    </Link>
  );
}

// デスクトップ用ナビゲーション
function DesktopNavigation({
  navigations,
}: {
  navigations: { name: string; href: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      {navigations.map((item) => (
        <HeaderLink key={item.href} name={item.name} href={item.href} />
      ))}
    </div>
  );
}

// ユーザーアイコン
function UserImage({ imageUrl }: { imageUrl: string | undefined | null }) {
  return (
    <Link
      href="/mypage"
      className="size-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors overflow-hidden relative"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="ユーザーの画像"
          fill
          className="object-cover"
        />
      ) : (
        <IoPersonOutline className="size-5 text-amber-600" />
      )}
    </Link>
  );
}

function UserInfo({ user }: { user: AuthUser }) {
  return (
    <>
      {
        user && <UserName name={user.name} />
      }
      <UserImage imageUrl={user ? user.image : undefined} />
    </>
  );
}

function UserName({ name }: { name: string }) {
  return (
    <span className="font-bold text-white text-xl max-w-[10ch] truncate inline-block">{name}</span>
  );
}


// ロゴ
function HeaderLogo() {
  return (
    <Link href="/">
      <h1 className="text-xl font-bold">ゲテナビ</h1>
    </Link>
  );
}

// デスクトップヘッダー（認証状態に応じたナビゲーション）
function DesktopHeader() {
  const { user, isAuthenticated } = useAuth();

  const filteredNavigation = isAuthenticated
    ? navigation.filter(
      (item) => item.name !== "ログイン" && item.name !== "新規登録"
    )
    : navigation;

  return (
    <div className="hidden md:flex items-center justify-between w-full">
      <HeaderLogo />
      <div className="flex items-center gap-3">
        <DesktopNavigation navigations={filteredNavigation} />
        <UserInfo user={user} />
      </div>
    </div>
  );
}

// モバイルヘッダー（従来のHeader）
function MobileHeader({
  title,
  left,
  right,
}: {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="md:hidden flex items-center gap-3 w-full">
      {left && <div className="shrink-0">{left}</div>}
      <h1 className="text-lg font-bold flex-1 truncate">{title || "ゲテナビ"}</h1>
      {right && <div className="shrink-0 flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function Header({ title, left, right }: Props) {
  return (
    <header className="fixed top-0 left-0 w-full bg-amber-600 text-white px-4 py-3 shadow-md z-50">
      <div className="flex items-center">
        <DesktopHeader />
        <MobileHeader title={title} left={left} right={right} />
      </div>
    </header>
  );
}
