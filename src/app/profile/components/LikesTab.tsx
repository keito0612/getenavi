"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loading } from "@/components/ui";
import { frontendFavoriteService } from "@/services/frontend";
import type { RestaurantData } from "@/lib/types";

type Props = {
  userId: string;
};

export function LikesTab({ userId: _userId }: Props) {
  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    frontendFavoriteService
      .getFavoriteRestaurants()
      .then(setFavorites)
      .catch(() => {
        // エラーは無視
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loading text="読み込み中" size="md" fullScreen={false} />;
  }

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">いいねがありません</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800">
      {favorites.map((restaurant) => (
        <Link
          key={restaurant.id}
          href={`/restaurants/${restaurant.id}`}
          className="flex gap-3 p-4 hover:bg-gray-800 transition-colors"
        >
          {restaurant.imageUrl && (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">{restaurant.name}</h3>
            <p className="text-sm text-gray-500 truncate">{restaurant.address}</p>
            {restaurant.tags && restaurant.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {restaurant.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs text-gray-400"
                  >
                    {tag.emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
