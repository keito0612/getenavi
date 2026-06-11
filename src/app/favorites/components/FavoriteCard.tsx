"use client";

import Link from "next/link";
import type { RestaurantWithRelations } from "@/lib/types";
import { CardContainer, FlexRow } from "@/components/ui/containers";
import { DangerLevel, TagBadge, Thumbnail } from "@/components/ui";

type Props = {
  restaurant: RestaurantWithRelations;
  onRemove: () => void;
};

export function FavoriteCard({ restaurant, onRemove }: Props) {
  return (
    <CardContainer>
      <Link
        href={`/restaurants/${restaurant.id}`}
        className="flex hover:bg-gray-50 transition-colors"
      >
        <Thumbnail src={restaurant.imageUrl} alt={restaurant.name} />

        <div className="flex-1 p-3 min-w-0">
          <h2 className="font-bold text-gray-900 truncate">{restaurant.name}</h2>
          <DangerLevel level={restaurant.dangerLevel} variant="dot" />
          <CardTags tags={restaurant.tags} />
        </div>
      </Link>

      <RemoveButton onRemove={onRemove} />
    </CardContainer>
  );
}

function CardTags({ tags }: { tags: RestaurantWithRelations["tags"] }) {
  return (
    <FlexRow gap="sm" wrap className="mt-2">
      {tags.slice(0, 3).map((tag) => (
        <TagBadge key={tag.id} emoji={tag.emoji} name={tag.name} variant="small" />
      ))}
    </FlexRow>
  );
}

function RemoveButton({ onRemove }: { onRemove: () => void }) {
  return (
    <div className="px-3 pb-3">
      <button
        onClick={onRemove}
        className="w-full py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        お気に入りから削除
      </button>
    </div>
  );
}
