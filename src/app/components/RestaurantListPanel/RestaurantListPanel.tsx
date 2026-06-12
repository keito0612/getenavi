"use client";

import type { RestaurantData } from "@/lib/types";
import { RestaurantCard } from "./RestaurantCard";

type Props = {
  restaurants: RestaurantData[];
  onRestaurantClick: (restaurant: RestaurantData) => void;
};

export function RestaurantListPanel({ restaurants, onRestaurantClick }: Props) {
  if (restaurants.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-500 text-sm">
        店舗が見つかりません
      </div>
    );
  }

  return (
    <>
      {/* モバイル: 横スクロール */}
      <div className="md:hidden flex gap-3 overflow-x-auto px-4 py-3">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => onRestaurantClick(restaurant)}
            variant="horizontal"
          />
        ))}
      </div>

      {/* デスクトップ: 縦スクロール */}
      <div className="hidden md:flex flex-col gap-3 overflow-y-auto h-full p-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => onRestaurantClick(restaurant)}
            variant="vertical"
          />
        ))}
      </div>
    </>
  );
}
