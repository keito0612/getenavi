"use client";

import { useState } from "react";
import Link from "next/link";
import { IoCreateOutline } from "react-icons/io5";
import { useAuth } from "@/hooks/useAuth";
import { useReviews } from "@/hooks/useReviews";
import { Stack } from "@/components/ui/containers";
import { Spinner, Modal, FormModal, Button } from "@/components/ui";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { StarRating } from "./StarRating";
import type { ModalState, ReviewData } from "@/lib/types";

type Props = {
  restaurantId: string;
};

function ReviewPostButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} size="lg" fullWidth className="flex items-center justify-center gap-2 rounded-xl">
      <IoCreateOutline className="size-5" />
      レビューを投稿
    </Button>
  );
}

function ReviewInfo({ reviews, averageRating }: { reviews: ReviewData[], averageRating: number }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900">
            {averageRating > 0 ? averageRating.toFixed(1) : "-"}
          </p>
          <StarRating rating={Math.round(averageRating)} readonly size="sm" />
        </div>
        <div className="text-sm text-gray-600">
          {reviews.length}件のレビュー
        </div>
      </div>
    </div>
  );
}

function ReviewLogin() {
  return (
    <div className="bg-gray-50 p-4 rounded-xl text-center">
      <p className="text-gray-600 mb-2">
        レビューを投稿するにはログインが必要です
      </p>
      <Link
        href="/auth/login"
        className="text-orange-500 hover:text-orange-600 font-medium"
      >
        ログインする
      </Link>
    </div>
  );
}

export function ReviewSection({ restaurantId }: Props) {
  const { isAuthenticated, isPending: authPending } = useAuth();
  const {
    reviews,
    isLoading,
    userReview,
    createReview,
    updateReview,
    deleteReview,
  } = useReviews(restaurantId);

  // 投稿フォームモーダルの状態
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 編集フォームモーダルの状態
  const [editingReview, setEditingReview] = useState<ReviewData | null>(null);

  // 結果通知モーダル状態
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "success",
    title: "",
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  // 平均評価を計算
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // 投稿処理
  const handleCreate = async (data: {
    rating: number;
    comment: string;
    images?: File[];
  }) => {
    const result = await createReview(data);
    if (result.success) {
      setIsCreateModalOpen(false);
      setModal({
        isOpen: true,
        type: "success",
        title: "投稿完了",
        message: "レビューを投稿しました",
      });
    } else {
      setModal({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: result.error,
      });
    }
    return result.success;
  };

  // 更新処理
  const handleUpdate = async (data: {
    rating: number;
    comment: string;
    newImages?: File[];
    existingImageUrls?: string[];
  }) => {
    if (!editingReview) return false;

    const result = await updateReview(editingReview.id, data);
    if (result.success) {
      setEditingReview(null);
      setModal({
        isOpen: true,
        type: "success",
        title: "更新完了",
        message: "レビューを更新しました",
      });
    } else {
      setModal({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: result.error,
      });
    }
    return result.success;
  };

  // 削除処理
  const handleDelete = async (reviewId: string) => {
    const result = await deleteReview(reviewId);
    if (!result.success) {
      setModal({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: result.error,
      });
    }
    return result.success;
  };

  return (
    <>
      <Stack gap="md">
        {/* 統計情報 */}
        <ReviewInfo reviews={reviews} averageRating={averageRating} />

        {/* 投稿ボタン */}
        {!authPending && (
          <>
            {isAuthenticated ? (
              !userReview && (
                <ReviewPostButton onClick={() => setIsCreateModalOpen(true)} />
              )
            ) : (
              <ReviewLogin />
            )}
          </>
        )}

        {/* レビュー一覧 */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : reviews.length > 0 ? (
          <Stack gap="sm">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwner={userReview?.id === review.id}
                onEdit={() => setEditingReview(review)}
                onDelete={handleDelete}
              />
            ))}
          </Stack>
        ) : (
          <div className="text-center py-8 text-gray-500">
            まだレビューがありません
          </div>
        )}
      </Stack>

      {/* 投稿フォームモーダル */}
      <FormModal
        isOpen={isCreateModalOpen}
        title="レビューを投稿"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <ReviewForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </FormModal>

      {/* 編集フォームモーダル */}
      <FormModal
        isOpen={editingReview !== null}
        title="レビューを編集"
        onClose={() => setEditingReview(null)}
      >
        {editingReview && (
          <ReviewForm
            initialRating={editingReview.rating}
            initialComment={editingReview.comment}
            initialImages={editingReview.images?.map((img) => img.imageUrl) ?? []}
            onSubmit={handleUpdate}
            onCancel={() => setEditingReview(null)}
            submitLabel="更新する"
            isEditMode
          />
        )}
      </FormModal>

      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
    </>
  );
}
