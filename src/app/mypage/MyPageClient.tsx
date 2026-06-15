"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { frontendUserService } from "@/services/frontend";
import { AuthError } from "@/lib/errors";
import { HomeHeader } from "@/app/components/HomeHeader";
import { ProfileSection } from "./components/ProfileSection";
import { PasswordSection } from "./components/PasswordSection";
import { FavoritesSection } from "./components/FavoritesSection";
import type { UserData } from "@/lib/types";

export function MyPageClient() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "favorites">("profile");

  useEffect(() => {
    frontendUserService
      .getCurrentUser()
      .then(setUser)
      .catch((err) => {
        console.error("Failed to get current user:", err);
        if (err instanceof AuthError && err.status === 401) {
          router.push("/auth/login");
        }
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleProfileUpdate = (updatedUser: UserData) => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: "profile" as const, label: "プロフィール" },
    { id: "password" as const, label: "パスワード変更" },
    { id: "favorites" as const, label: "お気に入り" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-14 lg:pt-16">
      <HomeHeader />

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
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
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
