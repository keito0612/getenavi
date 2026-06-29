"use client";

import Link from "next/link";
import type { RestaurantData } from "@/lib/types";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import {
  PageContainer,
  ContentContainer,
  Section,
  Stack,
  FlexRow,
} from "@/components/ui/containers";
import {
  Header,
  BackButton,
  FavoriteButton,
  Thumbnail,
  DangerLevel,
  TagBadge,
  LocationIcon,
} from "@/components/ui";
import { BusinessHoursCard } from "./components/BusinessHoursCard";
import { ReviewSection } from "./components/ReviewSection";

type Props = {
  restaurant: RestaurantData;
};

export function RestaurantDetail({ restaurant }: Props) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  return (
    <PageContainer className="pt-14 lg:pt-16">
      <Header
        title={restaurant.name}
        left={<BackButton />}
      />

      <Thumbnail src={restaurant.imageUrl} alt={restaurant.name} size="hero" />
      <ContentContainer padding="lg">
        <Stack gap="lg">
          <FlexRow align="between">
            <BasicInfo name={restaurant.name} address={restaurant.address} />
            <FavoriteButton
              isFavorite={isFavorite(restaurant.id)}
              onToggle={() => toggleFavorite(restaurant.id)}
              variant="header"
              size="lg"
            />
          </FlexRow>
          <DangerLevel level={restaurant.dangerLevel} variant="card" />
          <TagsSection tags={restaurant.tags} />
          {restaurant.description && (
            <DescriptionSection description={restaurant.description} />
          )}
          <BusinessHoursCard hours={restaurant.businessHours} />
          <ReviewSection restaurantId={restaurant.id} />
          <ActionButtons url={restaurant.url} restaurant={restaurant} />
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
}

function BasicInfo({ name, address }: { name: string; address: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
      <FlexRow gap="sm" className="mt-1 text-gray-600">
        <LocationIcon />
        <span>{address}</span>
      </FlexRow>
    </div>
  );
}

function TagsSection({ tags }: { tags: RestaurantData["tags"] }) {
  return (
    <Section label="取扱食材">
      <FlexRow gap="md" wrap>
        {tags.map((tag) => (
          <TagBadge key={tag.id} emoji={tag.emoji} name={tag.name} />
        ))}
      </FlexRow>
    </Section>
  );
}

function DescriptionSection({ description }: { description: string }) {
  return (
    <Section label="店舗紹介">
      <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-xl shadow-sm">
        {description}
      </p>
    </Section>
  );
}

type ActionButtonsProps = {
  url: string | null;
  restaurant: RestaurantData;
};

function ActionButtons({ url, restaurant }: ActionButtonsProps) {
  return (
    <Stack gap="sm">
      {url && <ExternalLink href={url} />}
      <MapLink lat={restaurant.latitude} lng={restaurant.longitude} />
    </Stack>
  );
}

function ExternalLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full py-4 bg-orange-500 text-white text-center rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg"
    >
      お店の情報を詳しく見る
    </a>
  );
}

function MapLink({ lat, lng }: { lat: number; lng: number }) {
  return (
    <Link
      href={`/?lat=${lat}&lng=${lng}`}
      className="block w-full py-4 bg-white text-orange-500 text-center rounded-xl font-medium border-2 border-orange-500 hover:bg-orange-50 transition-colors"
    >
      マップで確認する
    </Link>
  );
}
