"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useReviews } from "@/hooks/useReviews";
import { Section, Stack } from "@/components/ui/containers";
import { Spinner } from "@/components/ui";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { StarRating } from "./StarRating";

type Props = {
  restaurantId: string;
};

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

  // 平均評価を計算
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <Section label="レビュー">
      <Stack gap="md">
        {/* 統計情報 */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
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

        {/* 投稿フォーム */}
        {!authPending && (
          <>
            {isAuthenticated ? (
              !userReview && (
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-3">
                    レビューを投稿
                  </h4>
                  <ReviewForm
                    onSubmit={(data) => createReview(data)}
                  />
                </div>
              )
            ) : (
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
                onUpdate={updateReview}
                onDelete={deleteReview}
              />
            ))}
          </Stack>
        ) : (
          <div className="text-center py-8 text-gray-500">
            まだレビューがありません
          </div>
        )}
      </Stack>
    </Section>
  );
}
