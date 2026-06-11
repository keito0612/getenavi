"use client";

import Image from "next/image";
import type { RestaurantWithRelations } from "@/lib/types";
import { DangerLevel } from "@/components/ui";

type Props = {
  restaurant: RestaurantWithRelations;
  onClick: () => void;
  variant: "horizontal" | "vertical";
};

export function RestaurantCard({ restaurant, onClick, variant }: Props) {
  const isHorizontal = variant === "horizontal";

  return (
    <button
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-md overflow-hidden text-left transition-transform hover:scale-[1.02]
        ${isHorizontal ? "flex-shrink-0 w-48" : "w-full"}
      `}
    >
      <div className={`relative ${isHorizontal ? "h-28" : "h-32"}`}>
        {restaurant.imageUrl ? (
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">🍽️</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm truncate">{restaurant.name}</h3>
        <p className="text-xs text-gray-500 truncate mt-0.5">{restaurant.address}</p>
        <div className="mt-1">
          <DangerLevel level={restaurant.dangerLevel} variant="dot" />
        </div>
        {restaurant.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {restaurant.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded"
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
