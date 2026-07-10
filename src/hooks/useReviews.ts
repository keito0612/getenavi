"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { frontendReviewService } from "@/services/frontend/reviewService";
import type { ReviewData } from "@/lib/types";

// ============================================
// 型定義
// ============================================

type CreateReviewData = {
  rating: number;
  dangerLevel: number;
  comment: string;
  images?: File[];
};

type UpdateReviewData = {
  rating: number;
  dangerLevel: number;
  comment: string;
  newImages?: File[];
  existingImageUrls?: string[];
};

type MutationResult = {
  success: boolean;
  error?: string;
};

type UseReviewsReturn = {
  // データ
  reviews: ReviewData[];
  userReview: ReviewData | null;
  isLoading: boolean;
  error: Error | null;
  // 操作
  createReview: (data: CreateReviewData) => Promise<MutationResult>;
  updateReview: (reviewId: string, data: UpdateReviewData) => Promise<MutationResult>;
  deleteReview: (reviewId: string) => Promise<MutationResult>;
  refetch: () => Promise<void>;
};

// ============================================
// エラーメッセージマッピング
// ============================================

const ERROR_MESSAGES: Record<number, string> = {
  401: "ログインが必要です",
  403: "この操作を行う権限がありません",
  404: "レビューが見つかりません",
  409: "この店舗には既にレビューを投稿しています",
};

function getErrorMessage(status: number, defaultMessage: string): string {
  return ERROR_MESSAGES[status] || defaultMessage;
}

// ============================================
// useReviews
// ============================================

export function useReviews(restaurantId: string): UseReviewsReturn {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // レビュー一覧取得
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await frontendReviewService.getReviews(restaurantId);
        if (isMounted) {
          setReviews(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("レビューの取得に失敗しました"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [restaurantId]);

  // 手動リフェッチ用
  const refetch = useCallback(async () => {
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

  // ログインユーザーのレビュー
  const userReview = isAuthenticated && user
    ? reviews.find((r) => r.user.id === user.id) ?? null
    : null;

  // レビュー投稿
  const createReview = useCallback(
    async (data: CreateReviewData): Promise<MutationResult> => {
      try {
        const newReview = await frontendReviewService.createReview(restaurantId, data);
        setReviews((prev) => [newReview, ...prev]);
        return { success: true };
      } catch (err) {
        const status = (err as { status?: number }).status || 500;
        return {
          success: false,
          error: getErrorMessage(status, "レビューの投稿に失敗しました"),
        };
      }
    },
    [restaurantId]
  );

  // レビュー更新
  const updateReview = useCallback(
    async (reviewId: string, data: UpdateReviewData): Promise<MutationResult> => {
      try {
        const updatedReview = await frontendReviewService.updateReview(
          restaurantId,
          reviewId,
          data
        );
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? updatedReview : r))
        );
        return { success: true };
      } catch (err) {
        const status = (err as { status?: number }).status || 500;
        return {
          success: false,
          error: getErrorMessage(status, "レビューの更新に失敗しました"),
        };
      }
    },
    [restaurantId]
  );

  // レビュー削除
  const deleteReview = useCallback(
    async (reviewId: string): Promise<MutationResult> => {
      try {
        await frontendReviewService.deleteReview(restaurantId, reviewId);
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        return { success: true };
      } catch (err) {
        const status = (err as { status?: number }).status || 500;
        return {
          success: false,
          error: getErrorMessage(status, "レビューの削除に失敗しました"),
        };
      }
    },
    [restaurantId]
  );

  return {
    reviews,
    userReview,
    isLoading,
    error,
    createReview,
    updateReview,
    deleteReview,
    refetch,
  };
}
