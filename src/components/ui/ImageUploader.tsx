"use client";

import { RefObject } from "react";
import { X, ImagePlus } from "lucide-react";
import Image from "next/image";

export const MAX_IMAGE_COUNT = 4;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ExistingImageData {
    id: number;
    url: string;
}

interface ImageUploaderProps {
    inputRef: RefObject<HTMLInputElement | null>;
    existingImages?: ExistingImageData[];
    newPreviewImages: string[];
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveExistingImage?: (index: number) => void;
    onRemoveNewImage: (index: number) => void;
    errorMessage?: string;
}

export default function ImageUploader({
    inputRef,
    existingImages = [],
    newPreviewImages,
    onImageSelect,
    onRemoveExistingImage,
    onRemoveNewImage,
    errorMessage,
}: ImageUploaderProps) {
    const totalImageCount = existingImages.length + newPreviewImages.length;

    return (
        <div>
            <label className="block text-sm font-medium mb-2">
                写真（任意・最大{MAX_IMAGE_COUNT}枚）
            </label>
            <div className="flex flex-wrap gap-2">
                {/* Existing images (from server) */}
                {existingImages.map((image, index) => (
                    <div key={`existing-${image.id}`} className="relative w-20 h-20">
                        <Image
                            unoptimized={process.env.NODE_ENV === 'development'}
                            src={image.url}
                            alt={`既存画像 ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                        />
                        {onRemoveExistingImage && (
                            <button
                                type="button"
                                onClick={() => onRemoveExistingImage(index)}
                                aria-label={`既存画像${index + 1}を削除`}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        )}
                    </div>
                ))}
                {/* New images (preview) */}
                {newPreviewImages.map((preview, index) => (
                    <div key={`new-${index}`} className="relative w-20 h-20">
                        <Image
                            unoptimized
                            src={preview}
                            alt={`新規画像 ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={() => onRemoveNewImage(index)}
                            aria-label={`新規画像${index + 1}を削除`}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                ))}
                {totalImageCount < MAX_IMAGE_COUNT && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        aria-label="画像を追加"
                        className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center hover:border-gray-500 transition-colors"
                    >
                        <ImagePlus className="w-6 h-6 text-gray-500" />
                    </button>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={onImageSelect}
                className="hidden"
            />
            {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
        </div>
    );
}
