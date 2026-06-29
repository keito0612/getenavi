"use client";

import { HeartIcon } from "./Icons";

type Props = {
  isFavorite: boolean;
  onToggle: () => void;
  variant?: "default" | "header" | "card";
  size?: "sm" | "md" | "lg";
};

const VARIANTS = {
  default: "p-2 hover:bg-gray-100 rounded-full transition-colors",
  header: "p-2 hover:bg-white/20 rounded-full transition-colors",
  card: "p-1",
};

const SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-10 h-10",
};

export function FavoriteButton({ isFavorite, onToggle, variant = "default", size = "md" }: Props) {
  return (
    <button onClick={onToggle} className={VARIANTS[variant]}>
      <HeartIcon
        className={`${SIZES[size]} ${isFavorite ? "text-red-500 fill-current" : "text-gray-400"}`}
      />
    </button>
  );
}
