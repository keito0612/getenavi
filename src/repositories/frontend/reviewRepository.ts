import type { ReviewData, CreateReviewInput, UpdateReviewInput } from "@/lib/types";
import { authFetch } from "@/lib/authFetch";
import { UtilApi, ApiError } from "@/lib/utilApi";

export interface IFrontendReviewRepository {
  getReviews(restaurantId: string): Promise<ReviewData[]>;
  createReview(restaurantId: string, data: CreateReviewInput): Promise<ReviewData>;
  updateReview(reviewId: string, data: UpdateReviewInput): Promise<ReviewData>;
  deleteReview(reviewId: string): Promise<void>;
}

export class FrontendReviewRepository implements IFrontendReviewRepository {
  async getReviews(restaurantId: string): Promise<ReviewData[]> {
    const response = await fetch(
      UtilApi.buildUrl(`/api/restaurants/${restaurantId}/reviews`)
    );

    if (!response.ok) {
      throw new ApiError("レビューの取得に失敗しました", response.status);
    }

    const data = await response.json();
    return data.reviews;
  }

  async createReview(restaurantId: string, data: CreateReviewInput): Promise<ReviewData> {
    const response = await authFetch(
      UtilApi.buildUrl(`/api/restaurants/${restaurantId}/reviews`),
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 409) {
        throw new ApiError("この店舗には既にレビューを投稿しています", 409);
      }
      throw new ApiError(
        errorData.error || "レビューの投稿に失敗しました",
        response.status
      );
    }

    const result = await response.json();
    return result.review;
  }

  async updateReview(reviewId: string, data: UpdateReviewInput): Promise<ReviewData> {
    const response = await authFetch(
      UtilApi.buildUrl(`/api/reviews/${reviewId}`),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || "レビューの更新に失敗しました",
        response.status
      );
    }

    const result = await response.json();
    return result.review;
  }

  async deleteReview(reviewId: string): Promise<void> {
    const response = await authFetch(
      UtilApi.buildUrl(`/api/reviews/${reviewId}`),
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || "レビューの削除に失敗しました",
        response.status
      );
    }
  }
}

export const frontendReviewRepository = new FrontendReviewRepository();
