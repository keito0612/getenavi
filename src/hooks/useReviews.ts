"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { frontendReviewService } from "@/services/frontend/reviewService";
import { UtilApi } from "@/lib/utilApi";
import type { ReviewData, CreateReviewInput, UpdateReviewInput } from "@/lib/types";

type UseReviewsReturn = {
  reviews: ReviewData[];
  isLoading: boolean;
  error: Error | null;
  userReview: ReviewData | null;
  createReview: (data: CreateReviewInput) => Promise<boolean>;
  updateReview: (reviewId: string, data: UpdateReviewInput) => Promise<boolean>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
};

export function useReviews(restaurantId: string): UseReviewsReturn {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await frontendReviewService.getReviews(restaurantId);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("レビューの取得に失敗しました"));
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ログインユーザーのレビューを取得
  const userReview = isAuthenticated && user
    ? reviews.find((r) => r.user.id === user.id) ?? null
    : null;

  const createReview = useCallback(
    async (data: CreateReviewInput): Promise<boolean> => {
      try {
        const newReview = await frontendReviewService.createReview(restaurantId, data);
        setReviews((prev) => [newReview, ...prev]);
        toast.success("レビューを投稿しました");
        return true;
      } catch (err) {
        UtilApi.handleError(err, {
          401: () => toast.error("ログインが必要です"),
          409: () => toast.error("この店舗には既にレビューを投稿しています"),
        });
        return false;
      }
    },
    [restaurantId]
  );

  const updateReview = useCallback(
    async (reviewId: string, data: UpdateReviewInput): Promise<boolean> => {
      try {
        const updatedReview = await frontendReviewService.updateReview(reviewId, data);
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? updatedReview : r))
        );
        toast.success("レビューを更新しました");
        return true;
      } catch (err) {
        UtilApi.handleError(err, {
          401: () => toast.error("ログインが必要です"),
          403: () => toast.error("このレビューを編集する権限がありません"),
          404: () => toast.error("レビューが見つかりません"),
        });
        return false;
      }
    },
    []
  );

  const deleteReview = useCallback(async (reviewId: string): Promise<boolean> => {
    try {
      await frontendReviewService.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success("レビューを削除しました");
      return true;
    } catch (err) {
      UtilApi.handleError(err, {
        401: () => toast.error("ログインが必要です"),
        403: () => toast.error("このレビューを削除する権限がありません"),
        404: () => toast.error("レビューが見つかりません"),
      });
      return false;
    }
  }, []);

  return {
    reviews,
    isLoading,
    error,
    userReview,
    createReview,
    updateReview,
    deleteReview,
    refetch: fetchReviews,
  };
}
