"use client";

import type { RestaurantData } from "@/lib/types";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import {
  DrawerContainer,
  FlexRow,
  Stack,
} from "@/components/ui/containers";
import {
  CloseIcon,
  FavoriteButton,
  DangerLevel,
  TagBadge,
  Thumbnail,
  IconButton,
} from "@/components/ui";
import { BusinessHoursList } from "./components/BusinessHoursList";
import { ActionButtons } from "./components/ActionButtons";

type Props = {
  restaurant: RestaurantData | null;
  onClose: () => void;
};

export function RestaurantDrawer({ restaurant, onClose }: Props) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  if (!restaurant) return null;

  return (
    <DrawerContainer onClose={onClose}>
      <Stack gap="md">
        {restaurant.imageUrl && (
          <ImageSection src={restaurant.imageUrl} alt={restaurant.name} />
        )}

        <HeaderSection
          name={restaurant.name}
          address={restaurant.address}
          isFavorite={isFavorite(restaurant.id)}
          onToggleFavorite={() => toggleFavorite(restaurant.id)}
          onClose={onClose}
        />

        <DangerLevelSection level={restaurant.dangerLevel} />

        <TagsSection tags={restaurant.tags} />

        {restaurant.description && (
          <DescriptionSection description={restaurant.description} />
        )}

        <BusinessHoursList hours={restaurant.businessHours} />

        <ActionButtons
          url={restaurant.url}
          detailHref={`/restaurants/${restaurant.id}`}
          onDetailClick={onClose}
        />
      </Stack>
    </DrawerContainer>
  );
}

function ImageSection({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="-mx-5 -mt-4">
      <Thumbnail src={src} alt={alt} size="lg" />
    </div>
  );
}

type HeaderSectionProps = {
  name: string;
  address: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
};

function HeaderSection({ name, address, isFavorite, onToggleFavorite, onClose }: HeaderSectionProps) {
  return (
    <FlexRow align="between">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-gray-900 truncate">{name}</h2>
        <p className="text-sm text-gray-500 mt-1">{address}</p>
      </div>
      <FlexRow gap="sm">
        <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
        <IconButton onClick={onClose}>
          <CloseIcon className="w-5 h-5 text-gray-500" />
        </IconButton>
      </FlexRow>
    </FlexRow>
  );
}

function DangerLevelSection({ level }: { level: number }) {
  return (
    <FlexRow gap="md">
      <span className="text-sm text-gray-600">珍食レベル:</span>
      <DangerLevel level={level} />
    </FlexRow>
  );
}

function TagsSection({ tags }: { tags: RestaurantData["tags"] }) {
  return (
    <FlexRow gap="md" wrap>
      {tags.map((tag) => (
        <TagBadge key={tag.id} emoji={tag.emoji} name={tag.name} />
      ))}
    </FlexRow>
  );
}

function DescriptionSection({ description }: { description: string }) {
  return <p className="text-gray-700 leading-relaxed">{description}</p>;
}
