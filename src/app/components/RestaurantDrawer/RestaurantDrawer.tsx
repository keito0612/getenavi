"use client";

import { useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import type { RestaurantData } from "@/lib/types";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useReviews } from "@/hooks/useReviews";
import {
  DrawerContainer,
  FlexRow,
  Stack,
} from "@/components/ui/containers";
import {
  FavoriteButton,
  TagBadge,
  Thumbnail,
  Spinner,
  ImageLightbox,
  ImageWithLoader,
} from "@/components/ui";
import { BusinessHoursList } from "./components/BusinessHoursList";
import { ActionButtons } from "./components/ActionButtons";
import { ReviewSection } from "./components/ReviewSection";
import { DangerLevelRating } from "./components/DangerLevelRating";

type Props = {
  restaurant: RestaurantData | null;
  onClose: () => void;
};

type TabType = "details" | "reviews" | "gallery";

export function RestaurantDrawer({ restaurant, onClose }: Props) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const { reviews } = useReviews(restaurant?.id ?? "");

  if (!restaurant) return null;

  // レビューから最初の画像を取得
  const firstReviewImage = reviews
    .flatMap((r) => r.images)
    .map((img) => img.imageUrl)[0];

  return (
    <DrawerContainer title={restaurant.name} onClose={onClose}>
      <Stack gap="md">
        {/* ヘッダー画像（レビュー画像優先、なければ店舗画像） */}
        <HeaderImage
          imageUrl={firstReviewImage || restaurant.imageUrl}
          alt={restaurant.name}
        />

        {/* 住所・お気に入り */}
        <InfoSection
          name={restaurant.name}
          address={restaurant.address}
          isFavorite={isFavorite(restaurant.id)}
          onToggleFavorite={() => toggleFavorite(restaurant.id)}
        />

        {/* タブ */}
        <TabsSection
          activeTab={activeTab}
          onTabChange={setActiveTab}
          restaurant={restaurant}
          averageDangerLevel={
            reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.dangerLevel, 0) / reviews.length
              : 0
          }
        />
      </Stack>
    </DrawerContainer>
  );
}

function HeaderImage({ imageUrl, alt }: { imageUrl?: string | null; alt: string }) {
  return (
    <div className="-mx-5 -mt-4">
      {imageUrl ? (
        <Thumbnail src={imageUrl} alt={alt} size="lg" />
      ) : (
        <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
          <IoImageOutline className="w-16 h-16 text-white" />
        </div>
      )}
    </div>
  );
}

type InfoSectionProps = {
  name: string;
  address: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

function InfoSection({ name, address, isFavorite, onToggleFavorite }: InfoSectionProps) {
  return (
    <FlexRow align="between">
      <Stack gap="sm">
        <h2 className="text-xl font-bold text-gray-900 truncate">{name}</h2>
        <p className="text-sm text-gray-500 flex-1">{address}</p>
      </Stack>
      <FavoriteButton isFavorite={isFavorite} size="lg" onToggle={onToggleFavorite} />
    </FlexRow>
  );
}

type TabBarProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: "details", label: "詳細" },
    { id: "reviews", label: "レビュー" },
    { id: "gallery", label: "投稿画像" },
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
            ? "text-orange-500 border-b-2 border-orange-500"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function DetailsTab({ restaurant, averageDangerLevel }: { restaurant: RestaurantData; averageDangerLevel: number }) {
  return (
    <Stack gap="md">
      <DangerLevelSection level={averageDangerLevel} />
      <TagsSection tags={restaurant.tags} />
      {restaurant.description && (
        <DescriptionSection description={restaurant.description} />
      )}
      <BusinessHoursList hours={restaurant.businessHours} />
    </Stack>
  );
}

function GalleryTab({ restaurantId }: { restaurantId: string }) {
  const { reviews, isLoading } = useReviews(restaurantId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 全レビューから画像を抽出
  const allImages = reviews.flatMap((review) =>
    review.images.map((img) => ({
      url: img.imageUrl,
      reviewId: review.id,
      userName: review.user.name,
    }))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (allImages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        まだ投稿画像がありません
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {allImages.map((img, index) => (
          <button
            key={`${img.reviewId}-${index}`}
            type="button"
            onClick={() => setSelectedImage(img.url)}
            className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
          >
            <ImageWithLoader
              src={img.url}
              alt={`${img.userName}さんの投稿画像`}
              sizes="(max-width: 768px) 33vw, 128px"
              spinnerSize="sm"
            />
          </button>
        ))}
      </div>

      {/* 画像拡大モーダル */}
      {selectedImage && (
        <ImageLightbox
          src={selectedImage}
          alt="投稿画像（拡大）"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}

function DangerLevelSection({ level }: { level: number }) {
  const roundedLevel = Math.round(level);

  return (
    <FlexRow gap="md">
      <span className="text-sm text-gray-600">珍食レベル:</span>
      <div className="flex items-center gap-2">
        <DangerLevelRating level={roundedLevel} readonly size="md" />
        <span className="text-sm text-gray-500">({level.toFixed(1)})</span>
      </div>
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

function TabsSection({ restaurant, activeTab, onTabChange, averageDangerLevel }: { restaurant: RestaurantData; activeTab: TabType; onTabChange: (tab: TabType) => void; averageDangerLevel: number }) {
  return (
    <>
      <TabBar activeTab={activeTab} onTabChange={onTabChange} />
      <TabBody restaurant={restaurant} activeTab={activeTab} averageDangerLevel={averageDangerLevel} />
    </>
  );
}

function TabBody({ restaurant, activeTab, averageDangerLevel }: { restaurant: RestaurantData; activeTab: TabType; averageDangerLevel: number }) {
  switch (activeTab) {
    case "details":
      return <DetailsTab restaurant={restaurant} averageDangerLevel={averageDangerLevel} />
    case "reviews":
      return <ReviewSection restaurantId={restaurant.id} />
    case "gallery":
      return <GalleryTab restaurantId={restaurant.id} />;
  }
}

function DescriptionSection({ description }: { description: string }) {
  return <p className="text-gray-700 leading-relaxed">{description}</p>;
}
