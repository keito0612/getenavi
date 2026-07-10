"use client";

import Link from "next/link";
import type { RestaurantData } from "@/lib/types";
import { CardContainer, FlexRow } from "@/components/ui/containers";
import { FavoriteButton, DangerLevel, TagBadge, Thumbnail } from "@/components/ui";

type Props = {
  restaurant: RestaurantData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function RestaurantCard({ restaurant, isFavorite, onToggleFavorite }: Props) {
  return (
    <CardContainer className="hover:shadow-md transition-shadow">
      <Link href={`/restaurants/${restaurant.id}`} className="flex">
        <Thumbnail src={restaurant.imageUrl} alt={restaurant.name} />

        <div className="flex-1 p-3 min-w-0">
          <CardHeader
            name={restaurant.name}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
          <DangerLevel level={restaurant.dangerLevel} variant="dot" />
          <CardTags tags={restaurant.tags} />
        </div>
      </Link>
    </CardContainer>
  );
}

type CardHeaderProps = {
  name: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

function CardHeader({ name, isFavorite, onToggleFavorite }: CardHeaderProps) {
  return (
    <FlexRow align="between" gap="md">
      <h2 className="font-bold text-gray-900 truncate flex-1">{name}</h2>
      <div
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite();
        }}
      >
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          variant="card"
          size="sm"
        />
      </div>
    </FlexRow>
  );
}

function CardTags({ tags }: { tags: RestaurantData["tags"] }) {
  const visibleTags = tags.slice(0, 3);

  return (
    <FlexRow gap="sm" wrap className="mt-2">
      {visibleTags.map((tag) => (
        <TagBadge key={tag.id} emoji={tag.emoji} name={tag.name} variant="small" />
      ))}
    </FlexRow>
  );
}
