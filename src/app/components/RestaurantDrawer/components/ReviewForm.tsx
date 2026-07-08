"use client";

import { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarRating } from "./StarRating";
import ImageUploader from "@/components/ui/ImageUploader";
import { LoadingOverlay, FormTextarea, Button } from "@/components/ui";
import { createReviewSchema, type CreateReviewInput } from "@/lib/validations/review";

// ============================================
// 型定義
// ============================================

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

type Props = {
  initialRating?: number;
  initialComment?: string;
  initialImages?: string[];
  onSubmit: (data: CreateSubmitData | UpdateSubmitData) => Promise<boolean>;
  onCancel?: () => void;
  submitLabel?: string;
  isEditMode?: boolean;
};

// ============================================
// コンポーネント
// ============================================

export function ReviewForm({
  initialRating = 0,
  initialComment = "",
  initialImages = [],
  onSubmit,
  onCancel,
  submitLabel = "投稿する",
  isEditMode = false,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: initialRating,
      comment: initialComment,
      images: [],
    },
  });

  const comment = useWatch({ control, name: "comment" });
  const rating = useWatch({ control, name: "rating" });

  // 既存画像URL（編集時のみ使用、zodバリデーション対象外）
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(initialImages);

  const onFormSubmit = async (data: CreateReviewInput) => {
    let success: boolean;

    if (isEditMode) {
      success = await onSubmit({
        rating: data.rating,
        comment: data.comment,
        newImages: data.images,
        existingImageUrls,
      });
    } else {
      success = await onSubmit({
        rating: data.rating,
        comment: data.comment,
        images: data.images,
      });
    }

    if (success) {
      reset({ rating: 0, comment: "", images: [] });
      setExistingImageUrls([]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="relative space-y-4">
      <LoadingOverlay visible={isSubmitting} text={isEditMode ? "編集中です" : "投稿中です"} />

      {/* 評価 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          評価
        </label>
        <StarRating
          rating={rating}
          onChange={(value) => setValue("rating", value, { shouldValidate: true })}
          size="lg"
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      {/* コメント */}
      <FormTextarea
        id="comment"
        label="コメント"
        placeholder="お店の感想を書いてください..."
        maxLength={300}
        showCount
        value={comment}
        error={errors.comment?.message}
        {...register("comment")}
      />

      {/* 画像アップロード */}
      <Controller
        name="images"
        control={control}
        render={({ field, fieldState }) => (
          <ImageUploader
            value={field.value}
            onChange={field.onChange}
            existingImageUrls={existingImageUrls}
            onExistingImagesChange={setExistingImageUrls}
            error={fieldState.error?.message}
          />
        )}
      />

      {/* ボタン */}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
