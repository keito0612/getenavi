import { NextRequest, NextResponse } from "next/server";
import { reviewRepository, IReviewRepository } from "@/repositories/reviewRepository";
import {
  createReviewSchema,
  updateReviewSchema,
  restaurantIdSchema,
  reviewIdSchema,
} from "@/lib/validations/review";
import { ApiResponse } from "@/lib/api";
import { verifyBearerToken } from "@/lib/auth/verifyToken";

export class ReviewService {
  constructor(private readonly repository: IReviewRepository) {}

  /**
   * Bearer tokenからユーザーIDを取得
   */
  private async getUserIdFromToken(request: NextRequest): Promise<string | null> {
    const result = await verifyBearerToken(request.headers);
    return result?.userId ?? null;
  }

  /**
   * 飲食店のレビュー一覧を取得
   */
  async getReviews(request: NextRequest, restaurantId: string): Promise<NextResponse> {
    const result = restaurantIdSchema.safeParse({ restaurantId });
    if (!result.success) {
      return ApiResponse.validationError(result.error);
    }

    try {
      const reviews = await this.repository.getReviewsByRestaurantId(result.data.restaurantId);
      return ApiResponse.success({ reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return ApiResponse.serverError("レビューの取得に失敗しました");
    }
  }

  /**
   * レビューを投稿
   */
  async createReview(request: NextRequest, restaurantId: string): Promise<NextResponse> {
    const userId = await this.getUserIdFromToken(request);
    if (!userId) {
      return ApiResponse.unauthorized();
    }

    const restaurantResult = restaurantIdSchema.safeParse({ restaurantId });
    if (!restaurantResult.success) {
      return ApiResponse.validationError(restaurantResult.error);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return ApiResponse.error("リクエストボディが不正です");
    }

    const bodyResult = createReviewSchema.safeParse(body);
    if (!bodyResult.success) {
      return ApiResponse.validationError(bodyResult.error);
    }

    try {
      // 既にレビューが存在するかチェック
      const existingReview = await this.repository.getReviewByUserAndRestaurant(
        userId,
        restaurantResult.data.restaurantId
      );
      if (existingReview) {
        return ApiResponse.error("この店舗には既にレビューを投稿しています", 409);
      }

      const review = await this.repository.createReview(
        userId,
        restaurantResult.data.restaurantId,
        bodyResult.data.rating,
        bodyResult.data.comment
      );
      return ApiResponse.created({ review });
    } catch (error) {
      console.error("Error creating review:", error);
      return ApiResponse.serverError("レビューの投稿に失敗しました");
    }
  }

  /**
   * レビューを編集
   */
  async updateReview(request: NextRequest, reviewId: string): Promise<NextResponse> {
    const userId = await this.getUserIdFromToken(request);
    if (!userId) {
      return ApiResponse.unauthorized();
    }

    const reviewResult = reviewIdSchema.safeParse({ reviewId });
    if (!reviewResult.success) {
      return ApiResponse.validationError(reviewResult.error);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return ApiResponse.error("リクエストボディが不正です");
    }

    const bodyResult = updateReviewSchema.safeParse(body);
    if (!bodyResult.success) {
      return ApiResponse.validationError(bodyResult.error);
    }

    // 少なくとも1つの更新フィールドが必要
    if (bodyResult.data.rating === undefined && bodyResult.data.comment === undefined) {
      return ApiResponse.error("更新するフィールドを指定してください");
    }

    try {
      // レビューの存在確認と所有者チェック
      const existingReview = await this.repository.getReviewById(reviewResult.data.reviewId);
      if (!existingReview) {
        return ApiResponse.notFound("レビューが見つかりません");
      }
      if (existingReview.userId !== userId) {
        return ApiResponse.error("このレビューを編集する権限がありません", 403);
      }

      const review = await this.repository.updateReview(reviewResult.data.reviewId, {
        rating: bodyResult.data.rating,
        comment: bodyResult.data.comment,
      });
      return ApiResponse.success({ review });
    } catch (error) {
      console.error("Error updating review:", error);
      return ApiResponse.serverError("レビューの更新に失敗しました");
    }
  }

  /**
   * レビューを削除
   */
  async deleteReview(request: NextRequest, reviewId: string): Promise<NextResponse> {
    const userId = await this.getUserIdFromToken(request);
    if (!userId) {
      return ApiResponse.unauthorized();
    }

    const reviewResult = reviewIdSchema.safeParse({ reviewId });
    if (!reviewResult.success) {
      return ApiResponse.validationError(reviewResult.error);
    }

    try {
      // レビューの存在確認と所有者チェック
      const existingReview = await this.repository.getReviewById(reviewResult.data.reviewId);
      if (!existingReview) {
        return ApiResponse.notFound("レビューが見つかりません");
      }
      if (existingReview.userId !== userId) {
        return ApiResponse.error("このレビューを削除する権限がありません", 403);
      }

      await this.repository.deleteReview(reviewResult.data.reviewId);
      return ApiResponse.success({ success: true });
    } catch (error) {
      console.error("Error deleting review:", error);
      return ApiResponse.serverError("レビューの削除に失敗しました");
    }
  }
}

export const reviewService = new ReviewService(reviewRepository);
