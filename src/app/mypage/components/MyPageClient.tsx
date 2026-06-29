"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loading, Header } from "@/components/ui";
import { ProfileSection } from "./ProfileSection";
import { PasswordSection } from "./PasswordSection";
import { FavoritesSection } from "./FavoritesSection";
import type { UserData } from "@/lib/types";

export function MyPageClient() {
  const router = useRouter();
  const { user: authUser, isPending } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "favorites">("profile");

  // 認証ユーザー情報からUserData形式に変換
  const user: UserData | null = authUser ? {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    createdAt: new Date(authUser.createdAt),
    updatedAt: new Date(authUser.updatedAt),
  } : null;

  const handleProfileUpdate = (_updatedUser: UserData) => {
    // ページをリロードして最新の情報を取得
    router.refresh();
  };

  if (isPending) {
    return <Loading text="読み込み中" />;
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const tabs = [
    { id: "profile" as const, label: "プロフィール" },
    { id: "password" as const, label: "パスワード変更" },
    { id: "favorites" as const, label: "お気に入り" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-14 lg:pt-16">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">マイページ</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* タブナビゲーション */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* タブコンテンツ */}
          <div className="p-6">
            {activeTab === "profile" && (
              <ProfileSection user={user} onUpdate={handleProfileUpdate} />
            )}
            {activeTab === "password" && <PasswordSection />}
            {activeTab === "favorites" && <FavoritesSection />}
          </div>
        </div>
      </main>
    </div>
  );
}
