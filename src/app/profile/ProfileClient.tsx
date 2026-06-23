"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui";
import { HomeHeader } from "@/app/components/HomeHeader";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileTabs } from "./components/ProfileTabs";
import { PostsTab } from "./components/PostsTab";
import { LikesTab } from "./components/LikesTab";

export function ProfileClient() {
  const router = useRouter();
  const { user, isPending } = useAuth();
  const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");

  if (isPending) {
    return <Loading text="読み込み中" />;
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-14 lg:pt-16">
      <HomeHeader />

      <main>
        <ProfileHeader
          user={user}
          reviewCount={0}
          likeCount={0}
          isOwner={true}
        />

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="bg-gray-900">
          {activeTab === "posts" && <PostsTab userId={user.id} />}
          {activeTab === "likes" && <LikesTab userId={user.id} />}
        </div>
      </main>
    </div>
  );
}
