"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { frontendFavoriteService } from "@/services/frontend";
import type { RestaurantData } from "@/lib/types";

export function FavoritesSection() {
  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    frontendFavoriteService
      .getFavoriteRestaurants()
      .then(setFavorites)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "お気に入りの取得に失敗しました");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleRemoveFavorite = async (restaurantId: string) => {
    try {
      await frontendFavoriteService.removeFavorite(restaurantId);
      setFavorites((prev) => prev.filter((r) => r.id !== restaurantId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">お気に入り店舗</h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">お気に入りの店舗がありません</p>
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            店舗を探す
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((restaurant) => (
            <div
              key={restaurant.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {restaurant.imageUrl && (
                <div className="aspect-video bg-gray-100">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <Link
                  href={`/restaurants/${restaurant.id}`}
                  className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors"
                >
                  {restaurant.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{restaurant.address}</p>
                {restaurant.tags && restaurant.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {restaurant.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag.emoji} {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => handleRemoveFavorite(restaurant.id)}
                  className="mt-3 text-sm text-red-500 hover:text-red-600"
                >
                  お気に入りから削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
