"use client";

import { IoStar } from "react-icons/io5";

type Props = {
  rating: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
};

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function StarRating({
  rating,
  onChange,
  size = "md",
  readonly = false,
}: Props) {
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = sizeClasses[size];

  const handleClick = (value: number) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, value: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(value);
    }
  };

  return (
    <div className="flex gap-0.5" role="group" aria-label="評価">
      {stars.map((star) => {
        const isFilled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            disabled={readonly}
            className={`
              ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}
              transition-transform focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded
              disabled:opacity-100
            `}
            aria-label={`${star}点`}
            aria-pressed={isFilled}
          >
            <IoStar
              className={`${sizeClass} ${isFilled ? "text-yellow-400" : "text-gray-300"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
