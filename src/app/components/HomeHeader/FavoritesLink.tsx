"use client";

import Link from "next/link";
import { useFavoritesContext } from "@/contexts/FavoritesContext";

export function FavoritesLink() {
  const { favorites } = useFavoritesContext();

  return (
    <Link
      href="/favorites"
      className="text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
    >
      お気に入り
      {favorites.length > 0 && (
        <span className="ml-1 text-xs">({favorites.length})</span>
      )}
    </Link>
  );
}
