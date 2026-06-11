"use client";

import { useState, useCallback } from "react";
import type { Tag } from "@prisma/client";
import type { RestaurantWithRelations } from "@/lib/types";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { PageContainer, ContentContainer, Stack } from "@/components/ui/containers";
import { Header, BackButton, Spinner, EmptyState } from "@/components/ui";
import { SearchBar } from "./components/SearchBar";
import { TagFilterBar } from "./components/TagFilterBar";
import { RestaurantCard } from "./components/RestaurantCard";

type Props = {
  initialRestaurants: RestaurantWithRelations[];
  tags: Tag[];
};

export function RestaurantList({ initialRestaurants, tags }: Props) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  const handleTagToggle = useCallback(async (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(newSelectedTags);
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (newSelectedTags.length > 0) {
        params.set("tags", newSelectedTags.join(","));
      }
      const response = await fetch(`/api/restaurants?${params}`);
      const data = await response.json();
      setRestaurants(data.restaurants);
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTags]);

  const filteredRestaurants = restaurants.filter((r) =>
    searchQuery === "" ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <Header title="店舗一覧" left={<BackButton />} />

      <ContentContainer>
        <Stack>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="店舗名・説明で検索..."
          />

          <TagFilterBar
            tags={tags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />

          <ListContent
            isLoading={isLoading}
            restaurants={filteredRestaurants}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
}

type ListContentProps = {
  isLoading: boolean;
  restaurants: RestaurantWithRelations[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
};

function ListContent({ isLoading, restaurants, isFavorite, onToggleFavorite }: ListContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return <EmptyState emoji="🔍" message="該当する店舗がありません" />;
  }

  return (
    <Stack gap="sm">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          isFavorite={isFavorite(restaurant.id)}
          onToggleFavorite={() => onToggleFavorite(restaurant.id)}
        />
      ))}
    </Stack>
  );
}
