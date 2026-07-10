"use client";

import { useState } from "react";
import type { ReviewData } from "@/lib/types";
import { ImageLightbox, ImageWithLoader, Button, ConfirmModal } from "@/components/ui";
import { StarRating } from "./StarRating";
import { DangerLevelRating } from "./DangerLevelRating";

type Props = {
  review: ReviewData;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: (reviewId: string) => Promise<boolean>;
};

export function ReviewCard({ review, isOwner, onEdit, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(review.id);
    setIsDeleting(false);
    setIsConfirmOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
            {review.user.image ? (
              <ImageWithLoader
                src={review.user.image}
                alt={review.user.name}
                sizes="40px"
                spinnerSize="sm"
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
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={review.rating} readonly size="sm" />
          <DangerLevelRating level={review.dangerLevel} readonly size="sm" />
        </div>
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
              <ImageWithLoader
                src={img.imageUrl}
                alt="レビュー画像"
                sizes="80px"
                spinnerSize="sm"
              />
            </button>
          ))}
        </div>
      )}

      {isOwner && (
        <div className="mt-3 flex gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            編集
          </Button>
          <Button variant="danger" size="sm" onClick={() => setIsConfirmOpen(true)}>
            削除
          </Button>
        </div>
      )}

      {/* 画像拡大モーダル */}
      {selectedImage && (
        <ImageLightbox
          src={selectedImage}
          alt="レビュー画像（拡大）"
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* 削除確認モーダル */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="レビューを削除"
        message="このレビューを削除しますか？この操作は取り消せません。"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}
