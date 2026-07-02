"use client";

import { useState } from "react";
import Image from "next/image";
import type { ReviewData } from "@/lib/types";
import { StarRating } from "./StarRating";
import { ReviewForm } from "./ReviewForm";

type UpdateData = {
  rating: number;
  comment: string;
  newImages?: File[];
  existingImageUrls?: string[];
};

type Props = {
  review: ReviewData;
  isOwner: boolean;
  onUpdate: (reviewId: string, data: UpdateData) => Promise<boolean>;
  onDelete: (reviewId: string) => Promise<boolean>;
};

export function ReviewCard({ review, isOwner, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("このレビューを削除しますか？")) return;

    setIsDeleting(true);
    await onDelete(review.id);
    setIsDeleting(false);
  };

  const handleUpdate = async (data: {
    rating: number;
    comment: string;
    newImages?: File[];
    existingImageUrls?: string[];
  }) => {
    const success = await onUpdate(review.id, data);
    if (success) {
      setIsEditing(false);
    }
    return success;
  };


  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <ReviewForm
          initialRating={review.rating}
          initialComment={review.comment}
          initialImages={review.images?.map((img) => img.imageUrl) ?? []}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          submitLabel="更新する"
          isEditMode
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
            {review.user.image ? (
              <Image
                src={review.user.image}
                alt={review.user.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm font-medium">
                {review.user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{review.user.name}</p>
            <p className="text-xs text-gray-500">{review.timeAgo}</p>
          </div>
        </div>
        <StarRating rating={review.rating} readonly size="sm" />
      </div>

      <p className="mt-3 text-gray-700 whitespace-pre-wrap">{review.comment}</p>

      {/* レビュー画像 */}
      {review.images && review.images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedImage(img.imageUrl)}
              className="relative w-20 h-20 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            >
              <Image
                src={img.imageUrl}
                alt="レビュー画像"
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {isOwner && (
        <div className="mt-3 flex gap-2 justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            編集
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "削除中..." : "削除"}
          </button>
        </div>
      )}

      {/* 画像拡大モーダル */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="レビュー画像（拡大）"
              fill
              sizes="100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl"
              aria-label="閉じる"
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
