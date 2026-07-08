"use client";

import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  onClose: () => void;
};

export function ImageLightbox({ src, alt = "画像（拡大）", onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-3xl max-h-[90vh] w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl"
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
    </div>
  );
}
