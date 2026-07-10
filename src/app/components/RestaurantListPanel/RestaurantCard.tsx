"use client";

import { IoImageOutline, IoSkull } from "react-icons/io5";
import type { RestaurantData } from "@/lib/types";
import { ImageWithLoader } from "@/components/ui";

type Props = {
  restaurant: RestaurantData;
  onClick: () => void;
  variant: "horizontal" | "vertical";
};

const levelColors = [
  "text-green-500",
  "text-lime-500",
  "text-yellow-500",
  "text-orange-500",
  "text-red-500",
];

function DangerLevelDot({ level }: { level: number }) {
  const roundedLevel = Math.round(level);
  const filledColor = levelColors[Math.max(0, Math.min(roundedLevel - 1, 4))] || levelColors[0];
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((lv) => (
          <IoSkull
            key={lv}
            className={`w-3 h-3 ${lv <= roundedLevel ? filledColor : "text-gray-300"}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({level.toFixed(1)})</span>
    </div>
  );
}

export function RestaurantCard({ restaurant, onClick, variant }: Props) {
  if (variant === "horizontal") {
    return <HorizontalCard restaurant={restaurant} onClick={onClick} />;
  }
  return <VerticalCard restaurant={restaurant} onClick={onClick} />;
}

// モバイル用: 横長カード（左に画像、右に情報）- 画面幅いっぱいでスナップスクロール
function HorizontalCard({ restaurant, onClick }: { restaurant: RestaurantData; onClick: () => void }) {
  const displayImage = restaurant.firstReviewImageUrl || restaurant.imageUrl;

  return (
    <button
      onClick={onClick}
      className="w-[calc(100vw-2rem)] flex-shrink-0 snap-center bg-white rounded-lg shadow-md overflow-hidden text-left transition-transform hover:scale-[1.02] flex h-24"
    >
      {/* 左: 画像 */}
      <div className="relative w-24 h-full flex-shrink-0">
        {displayImage ? (
          <ImageWithLoader
            src={displayImage}
            alt={restaurant.name}
            sizes="96px"
            spinnerSize="sm"
          />
        ) : (
          <div className="w-full h-full bg-gray-400 flex items-center justify-center">
            <IoImageOutline className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      {/* 右: 情報 */}
      <div className="flex-1 p-3 min-w-0 flex flex-col justify-center">
        <h3 className="font-bold text-sm truncate">{restaurant.name}</h3>
        <p className="text-xs text-gray-500 truncate mt-0.5">{restaurant.address}</p>
        <div className="mt-1">
          <DangerLevelDot level={restaurant.reviewAverageDangerLevel} />
        </div>
        {restaurant.tags.length > 0 && (
          <div className="flex gap-1 mt-1 overflow-x-auto scrollbar-none">
            {restaurant.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0"
              >
                {tag.emoji} {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

// デスクトップ用: 縦長カード（上に画像、下に情報）
function VerticalCard({ restaurant, onClick }: { restaurant: RestaurantData; onClick: () => void }) {
  const displayImage = restaurant.firstReviewImageUrl || restaurant.imageUrl;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg shadow-md overflow-hidden text-left transition-transform hover:scale-[1.02]"
    >
      <div className="relative h-32">
        {displayImage ? (
          <ImageWithLoader
            src={displayImage}
            alt={restaurant.name}
            sizes="(max-width: 768px) 100vw, 320px"
            spinnerSize="sm"
          />
        ) : (
          <div className="w-full h-full bg-gray-400 flex items-center justify-center">
            <IoImageOutline className="w-12 h-12 text-white" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm truncate">{restaurant.name}</h3>
        <p className="text-xs text-gray-500 truncate mt-0.5">{restaurant.address}</p>
        <div className="mt-1">
          <DangerLevelDot level={restaurant.reviewAverageDangerLevel} />
        </div>
        {restaurant.tags.length > 0 && (
          <div className="flex gap-1 mt-2 overflow-x-auto scrollbar-none">
            {restaurant.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0"
              >
                {tag.emoji} {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
