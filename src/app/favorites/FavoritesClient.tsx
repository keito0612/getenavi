"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { RestaurantData } from "@/lib/types";
import { frontendFavoriteService } from "@/services/frontend";
import { PageContainer, ContentContainer, Stack } from "@/components/ui/containers";
import { Spinner, EmptyState, Header } from "@/components/ui";
import { FavoriteCard } from "./components/FavoriteCard";

export function FavoritesClient() {
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const results = await frontendFavoriteService.getFavoriteRestaurants();
        setRestaurants(results);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (restaurantId: string) => {
    try {
      await frontendFavoriteService.removeFavorite(restaurantId);
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <PageContainer className="pt-14 lg:pt-16">
      <Header />
      <ContentContainer>
        <FavoritesContent
          isLoading={isLoading}
          restaurants={restaurants}
          onRemove={handleRemove}
        />
      </ContentContainer>
    </PageContainer>
  );
}

type ContentProps = {
  isLoading: boolean;
  restaurants: RestaurantData[];
  onRemove: (id: string) => void;
};

function FavoritesContent({ isLoading, restaurants, onRemove }: ContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          emoji="💔"
          message="お気に入りに登録された店舗がありません"
          action={<FindRestaurantsLink />}
        />
      </div>
    );
  }

  return (
    <Stack gap="sm">
      {restaurants.map((restaurant) => (
        <FavoriteCard
          key={restaurant.id}
          restaurant={restaurant}
          onRemove={() => onRemove(restaurant.id)}
        />
      ))}
    </Stack>
  );
}

function FindRestaurantsLink() {
  return (
    <Link
      href="/"
      className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
    >
      店舗を探す
    </Link>
  );
}
