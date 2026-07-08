"use client";

import { useState } from "react";
import { Spinner } from "./Spinner";

type Props = {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "hero";
  fallbackEmoji?: string;
};

const SIZES = {
  sm: "w-20 h-20",
  md: "w-28 h-28",
  lg: "w-full h-48",
  hero: "w-full h-64",
};

const SPINNER_SIZES: Record<string, "sm" | "md" | "lg"> = {
  sm: "sm",
  md: "sm",
  lg: "md",
  hero: "lg",
};

export function Thumbnail({ src, alt, size = "md", fallbackEmoji = "🍽️" }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const sizeClass = SIZES[size];

  if (src) {
    return (
      <div className={`${sizeClass} bg-gray-200 overflow-hidden relative`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <Spinner size={SPINNER_SIZES[size]} />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setIsLoading(false)}
        />
        {size === "hero" && !isLoading && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        )}
      </div>
    );
  }

  return (
    <div className={`${sizeClass} bg-gray-200 flex items-center justify-center`}>
      <span className={`text-gray-400 ${size === "hero" || size === "lg" ? "text-4xl" : "text-2xl"}`}>
        {fallbackEmoji}
      </span>
    </div>
  );
}
