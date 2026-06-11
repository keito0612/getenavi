"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { RestaurantWithRelations } from "@/lib/types";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { PageContainer, ContentContainer, Stack } from "@/components/ui/containers";
import { Header, BackButton, Spinner, EmptyState } from "@/components/ui";
import { FavoriteCard } from "./components/FavoriteCard";

export function FavoritesClient() {
  const { favorites, isLoaded, removeFavorite } = useFavoritesContext();
  const [restaurants, setRestaurants] = useState<RestaurantWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setRestaurants([]);
        setIsLoading(false);
        return;
      }

      try {
        const results = await Promise.all(
          favorites.map(async (id) => {
            const res = await fetch(`/api/restaurants/${id}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.restaurant as RestaurantWithRelations;
          })
        );
        setRestaurants(results.filter((r): r is RestaurantWithRelations => r !== null));
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites, isLoaded]);

  return (
    <PageContainer>
      <Header title="お気に入り" left={<BackButton />} />

      <ContentContainer>
        <FavoritesContent
          isLoading={isLoading}
          restaurants={restaurants}
          onRemove={removeFavorite}
        />
      </ContentContainer>
    </PageContainer>
  );
}

type ContentProps = {
  isLoading: boolean;
  restaurants: RestaurantWithRelations[];
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
