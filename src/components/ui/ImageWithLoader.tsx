"use client";

import { useState } from "react";
import Image from "next/image";
import { Spinner } from "./Spinner";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  spinnerSize?: "sm" | "md" | "lg";
};

export function ImageWithLoader({
  src,
  alt,
  fill = true,
  sizes,
  className = "object-cover",
  spinnerSize = "sm",
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <Spinner size={spinnerSize} />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={`${className} transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}
