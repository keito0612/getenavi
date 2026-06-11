"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Tag } from "@prisma/client";
import type { RestaurantWithRelations } from "@/lib/types";
import { LoadingOverlay, MapSkeleton } from "@/components/ui";
import { HomeHeader } from "./components/HomeHeader";
import { TagFilter } from "./components/TagFilter";
import { SearchBar } from "./components/SearchBar";
import { RestaurantDrawer } from "./components/RestaurantDrawer";
import { RestaurantListPanel } from "./components/RestaurantListPanel";

const Map = dynamic(() => import("./components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

type Props = {
  initialTags: Tag[];
  initialRestaurants: RestaurantWithRelations[];
};

export function HomeClient({ initialTags, initialRestaurants }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantWithRelations | null>(null);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRestaurants = useCallback(async (query: string, tags: string[]) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) {
        params.set("q", query);
      }
      if (tags.length > 0) {
        params.set("tags", tags.join(","));
      }
      const response = await fetch(`/api/restaurants?${params}`);
      const data = await response.json();
      setRestaurants(data.restaurants);
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    fetchRestaurants(query, selectedTags);
  }, [selectedTags, fetchRestaurants]);

  const handleTagToggle = useCallback(async (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(newSelectedTags);
    fetchRestaurants(searchQuery, newSelectedTags);
  }, [selectedTags, searchQuery, fetchRestaurants]);

  const handleMarkerClick = useCallback((restaurant: RestaurantWithRelations) => {
    setSelectedRestaurant(restaurant);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedRestaurant(null);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <HomeHeader />

      <TagFilter
        tags={initialTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      />

      <div className="flex-1 relative">
        <LoadingOverlay visible={isLoading} />
        <Map restaurants={restaurants} onMarkerClick={handleMarkerClick} />

        {/* 検索バー: モバイルは上部（右側にズームコントロール分のスペース）、デスクトップは飲食店一覧の右横 */}
        <div className="absolute top-4 left-4 right-16 z-10 md:left-84 md:right-auto md:w-1/3">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* モバイル: 下部にオーバーレイ */}
        <div className="absolute bottom-0 left-0 right-0 md:hidden">
          <RestaurantListPanel
            restaurants={restaurants}
            onRestaurantClick={handleMarkerClick}
          />
        </div>

        {/* デスクトップ: 左側にオーバーレイ */}
        <div className="absolute top-0 left-0 bottom-0 w-80 hidden md:block">
          <RestaurantListPanel
            restaurants={restaurants}
            onRestaurantClick={handleMarkerClick}
          />
        </div>
      </div>

      <RestaurantDrawer restaurant={selectedRestaurant} onClose={handleCloseDrawer} />
    </div>
  );
}
