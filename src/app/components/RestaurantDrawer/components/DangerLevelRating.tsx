"use client";

import { IoSkull } from "react-icons/io5";

type Props = {
  level: number;
  onChange?: (level: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
};

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const levelColors = [
  "text-green-500",
  "text-lime-500",
  "text-yellow-500",
  "text-orange-500",
  "text-red-500",
];

export function DangerLevelRating({
  level,
  onChange,
  size = "md",
  readonly = false,
}: Props) {
  const levels = [1, 2, 3, 4, 5];
  const sizeClass = sizeClasses[size];
  const filledColor = levelColors[Math.max(0, Math.min(level - 1, 4))] || levelColors[0];

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
    <div className="flex gap-0.5" role="group" aria-label="珍食レベル">
      {levels.map((lv) => {
        const isFilled = lv <= level;
        return (
          <button
            key={lv}
            type="button"
            onClick={() => handleClick(lv)}
            onKeyDown={(e) => handleKeyDown(e, lv)}
            disabled={readonly}
            className={`
              ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}
              transition-transform focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded
              disabled:opacity-100
            `}
            aria-label={`レベル${lv}`}
            aria-pressed={isFilled}
          >
            <IoSkull
              className={`${sizeClass} ${isFilled ? filledColor : "text-gray-300"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
