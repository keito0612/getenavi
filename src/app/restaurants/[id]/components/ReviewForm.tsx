"use client";

import { useState, useRef, useCallback } from "react";
import { StarRating } from "./StarRating";
import ImageUploader, { MAX_IMAGE_COUNT, MAX_FILE_SIZE } from "@/components/ui/ImageUploader";

type CreateSubmitData = {
  rating: number;
  comment: string;
  images?: File[];
};

type UpdateSubmitData = {
  rating: number;
  comment: string;
  newImages?: File[];
  existingImageUrls?: string[];
};

type ExistingImage = {
  id: number;
  url: string;
};

type Props = {
  initialRating?: number;
  initialComment?: string;
  initialImages?: string[];
  onSubmit: (data: CreateSubmitData | UpdateSubmitData) => Promise<boolean>;
  onCancel?: () => void;
  submitLabel?: string;
  isEditMode?: boolean;
};

export function ReviewForm({
  initialRating = 0,
  initialComment = "",
  initialImages = [],
  onSubmit,
  onCancel,
  submitLabel = "投稿する",
  isEditMode = false,
}: Props) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviewImages, setNewPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    initialImages.map((url, index) => ({ id: index, url }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ rating?: string; comment?: string; image?: string }>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentTotal = existingImages.length + newFiles.length;
    const remainingSlots = MAX_IMAGE_COUNT - currentTotal;

    if (remainingSlots <= 0) {
      setErrors((prev) => ({ ...prev, image: `画像は最大${MAX_IMAGE_COUNT}枚までです` }));
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];

      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({ ...prev, image: "ファイルサイズは5MB以下にしてください" }));
        continue;
      }

      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: "JPEG、PNG形式の画像のみアップロードできます" }));
        continue;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setNewFiles((prev) => [...prev, ...validFiles]);
      setNewPreviewImages((prev) => [...prev, ...newPreviews]);
      setErrors((prev) => ({ ...prev, image: undefined }));
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [existingImages.length, newFiles.length]);

  const handleRemoveExistingImage = useCallback((index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRemoveNewImage = useCallback((index: number) => {
    URL.revokeObjectURL(newPreviewImages[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviewImages((prev) => prev.filter((_, i) => i !== index));
  }, [newPreviewImages]);

  const validate = (): boolean => {
    const newErrors: { rating?: string; comment?: string } = {};

    if (rating < 1 || rating > 5) {
      newErrors.rating = "評価を選択してください";
    }

    if (!comment.trim()) {
      newErrors.comment = "コメントを入力してください";
    } else if (comment.length > 1000) {
      newErrors.comment = "コメントは1000文字以内で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    let success: boolean;
    if (isEditMode) {
      success = await onSubmit({
        rating,
        comment,
        newImages: newFiles,
        existingImageUrls: existingImages.map((img) => img.url),
      });
    } else {
      success = await onSubmit({
        rating,
        comment,
        images: newFiles,
      });
    }

    setIsSubmitting(false);

    if (success) {
      // Cleanup preview URLs
      newPreviewImages.forEach((url) => URL.revokeObjectURL(url));
      setRating(0);
      setComment("");
      setNewFiles([]);
      setNewPreviewImages([]);
      setExistingImages([]);
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          評価
        </label>
        <StarRating rating={rating} onChange={setRating} size="lg" />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          コメント
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          placeholder="お店の感想を書いてください..."
        />
        <div className="flex justify-between mt-1">
          {errors.comment ? (
            <p className="text-sm text-red-600">{errors.comment}</p>
          ) : (
            <span />
          )}
          <span className={`text-xs ${comment.length > 1000 ? "text-red-600" : "text-gray-500"}`}>
            {comment.length}/1000
          </span>
        </div>
      </div>

      <ImageUploader
        inputRef={inputRef}
        existingImages={existingImages}
        newPreviewImages={newPreviewImages}
        onImageSelect={handleImageSelect}
        onRemoveExistingImage={handleRemoveExistingImage}
        onRemoveNewImage={handleRemoveNewImage}
        errorMessage={errors.image}
      />

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "送信中..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
