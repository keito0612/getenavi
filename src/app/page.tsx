import { Suspense } from "react";
import { tagService } from "@/services/tagService";
import { restaurantService } from "@/services/restaurantService";
import { HomeClient } from "./HomeClient";
import { HeaderSkeleton, MapSkeleton } from "@/components/ui";

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [tags, restaurants] = await Promise.all([
    tagService.getTags(),
    restaurantService.getRestaurants(),
  ]);

  return <HomeClient initialTags={tags} initialRestaurants={restaurants} />;
}

function HomeLoading() {
  return (
    <div className="h-screen flex flex-col">
      <HeaderSkeleton />
      <TagFilterSkeleton />

      <div className="flex-1 relative">
        <MapSkeleton />

        {/* 検索バー: モバイルは上部（右側にズームコントロール分のスペース）、デスクトップは飲食店一覧の右横 */}
        <div className="absolute top-4 left-4 right-16 z-10 md:left-84 md:right-auto md:w-1/3">
          <SearchBarSkeleton />
        </div>

        {/* モバイル: 下部にオーバーレイ */}
        <div className="absolute bottom-0 left-0 right-0 md:hidden">
          <RestaurantListPanelSkeleton variant="horizontal" />
        </div>

        {/* デスクトップ: 左側にオーバーレイ */}
        <div className="absolute top-0 left-0 bottom-0 w-80 hidden md:block">
          <RestaurantListPanelSkeleton variant="vertical" />
        </div>
      </div>
    </div>
  );
}

function TagFilterSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-white/90 backdrop-blur-sm shadow-sm">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-8 w-20 rounded-full bg-gray-200 animate-pulse shrink-0" />
      ))}
    </div>
  );
}

function SearchBarSkeleton() {
  return (
    <div className="w-full h-10 bg-white rounded-full shadow-md animate-pulse" />
  );
}

function RestaurantListPanelSkeleton({ variant }: { variant: "horizontal" | "vertical" }) {
  if (variant === "horizontal") {
    return (
      <div className="flex gap-3 overflow-x-auto px-4 py-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="shrink-0 w-48 bg-white/90 rounded-lg animate-pulse shadow-md">
            <div className="h-28 bg-gray-200 rounded-t-lg" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-80 h-full flex flex-col gap-3 overflow-y-auto p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white/90 rounded-lg animate-pulse shadow-md">
          <div className="h-32 bg-gray-200 rounded-t-lg" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
