"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/ui";
import { useFavoritesContext } from "@/contexts/FavoritesContext";

export function FavoritesLink() {
  const { favorites } = useFavoritesContext();

  return (
    <Link
      href="/favorites"
      className="relative p-2 hover:bg-white/20 rounded-full transition-colors"
    >
      <HeartIcon />
      {favorites.length > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {favorites.length}
        </span>
      )}
    </Link>
  );
}
