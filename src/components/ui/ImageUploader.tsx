"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ImagePlus } from "lucide-react";
import Image from "next/image";

export const MAX_IMAGE_COUNT = 4;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

type Props = {
  // 新規画像（File配列）
  value?: File[];
  onChange?: (files: File[]) => void;
  // 既存画像URL（編集時）
  existingImageUrls?: string[];
  onExistingImagesChange?: (urls: string[]) => void;
  // エラー
  error?: string;
};

export default function ImageUploader({
  value = [],
  onChange,
  existingImageUrls = [],
  onExistingImagesChange,
  error,
}: Props) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const totalCount = existingImageUrls.length + value.length;

  // File配列からプレビューURLを生成
  useEffect(() => {
    const urls = value.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [value]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !onChange) return;

      const remainingSlots = MAX_IMAGE_COUNT - totalCount;
      if (remainingSlots <= 0) {
        setLocalError(`画像は最大${MAX_IMAGE_COUNT}枚までです`);
        return;
      }

      const validFiles: File[] = [];

      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        const file = files[i];

        if (file.size > MAX_FILE_SIZE) {
          setLocalError("ファイルサイズは5MB以下にしてください");
          continue;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
          setLocalError("JPEG、PNG形式の画像のみアップロードできます");
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        onChange([...value, ...validFiles]);
        setLocalError(undefined);
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [value, onChange, totalCount]
  );

  const handleRemoveNewImage = useCallback(
    (index: number) => {
      if (!onChange) return;
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const handleRemoveExistingImage = useCallback(
    (index: number) => {
      if (!onExistingImagesChange) return;
      onExistingImagesChange(existingImageUrls.filter((_, i) => i !== index));
    },
    [existingImageUrls, onExistingImagesChange]
  );

  const displayError = error || localError;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        写真（任意・最大{MAX_IMAGE_COUNT}枚）
      </label>
      <div className="flex flex-wrap gap-2">
        {/* 既存画像 */}
        {existingImageUrls.map((url, index) => (
          <div key={`existing-${index}`} className="relative w-20 h-20">
            <Image
              unoptimized={process.env.NODE_ENV === "development"}
              src={url}
              alt={`既存画像 ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveExistingImage(index)}
              aria-label={`既存画像${index + 1}を削除`}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}

        {/* 新規画像プレビュー */}
        {previewUrls.map((url, index) => (
          <div key={`new-${index}`} className="relative w-20 h-20">
            <Image
              unoptimized
              src={url}
              alt={`新規画像 ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveNewImage(index)}
              aria-label={`新規画像${index + 1}を削除`}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}

        {/* 追加ボタン */}
        {totalCount < MAX_IMAGE_COUNT && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="画像を追加"
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            <ImagePlus className="w-6 h-6 text-gray-400" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {displayError && (
        <p className="text-red-500 text-sm mt-1">{displayError}</p>
      )}
    </div>
  );
}
