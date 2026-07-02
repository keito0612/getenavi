import { NextRequest, NextResponse } from "next/server";
import { reviewRepository, IReviewRepository, ReviewWithUser } from "@/repositories/reviewRepository";
import {
  createReviewSchema,
  updateReviewSchema,
  restaurantIdSchema,
  reviewIdSchema,
} from "@/lib/validations/review";
import { ApiResponse } from "@/lib/api";
import { getUserId } from "@/lib/auth/getUserId";
import { imageService, ImageUploadError } from "@/services/imageService";
import { getRelativeTime } from "@/lib/date";
import { ReviewData } from "@/lib/types";

/**
 * レビューデータをAPIレスポンス用に変換（timeAgo付加）
 */
function toReviewData(review: ReviewWithUser): ReviewData {
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
    timeAgo: getRelativeTime(review.createdAt),
    user: {
      id: review.user.id,
      name: review.user.name,
      image: review.user.image,
    },
    images: review.images.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      order: img.order,
    })),
  };
}

export class ReviewService {
  constructor(
    private readonly repository: IReviewRepository,
    private readonly userId?: string,
    private readonly request?: NextRequest
  ) { }

  /**
   * 認証済みサービスインスタンスを生成
   */
  static async withAuth(request: NextRequest): Promise<ReviewService> {
    const userId = await getUserId(request);
    return new ReviewService(reviewRepository, userId, request);
  }

  /**
   * 飲食店のレビュー一覧を取得（認証不要）
   */
  async getReviews(restaurantId: string): Promise<NextResponse> {
    const result = restaurantIdSchema.safeParse({ restaurantId });
    if (!result.success) {
      return ApiResponse.validationError(result.error);
    }

    try {
      const reviews = await this.repository.getReviewsByRestaurantId(result.data.restaurantId);
      return ApiResponse.success({ reviews: reviews.map(toReviewData) });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return ApiResponse.serverError("レビューの取得に失敗しました");
    }
  }

  /**
   * レビューを投稿（認証必須、multipart/form-data）
   */
  async createReview(restaurantId: string): Promise<NextResponse> {
    if (!this.userId || !this.request) {
      return ApiResponse.unauthorized("認証が必要です");
    }

    const restaurantResult = restaurantIdSchema.safeParse({ restaurantId });
    if (!restaurantResult.success) {
      return ApiResponse.validationError(restaurantResult.error);
    }

    // FormDataをパース
    let formData: FormData;
    try {
      formData = await this.request.formData();
    } catch {
      return ApiResponse.error("リクエストが不正です");
    }

    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;
    const images = (formData.getAll("images") as File[]).filter((img) => img.size > 0);

    // バリデーション（画像含む）
    const bodyResult = createReviewSchema.safeParse({
      rating,
      comment,
      images: images.length > 0 ? images : undefined,
    });
    if (!bodyResult.success) {
      return ApiResponse.validationError(bodyResult.error);
    }

    try {
      // 既にレビューが存在するかチェック
      const existingReview = await this.repository.getReviewByUserAndRestaurant(
        this.userId,
        restaurantResult.data.restaurantId
      );
      if (existingReview) {
        return ApiResponse.error("この店舗には既にレビューを投稿しています", 409);
      }

      // 画像をアップロード
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const uploadResults = await imageService.uploadMultiple(images, {
          subDir: "reviews",
        });
        imageUrls = uploadResults.map((r) => r.publicUrl);
      }

      const review = await this.repository.createReview(
        this.userId,
        restaurantResult.data.restaurantId,
        bodyResult.data.rating,
        bodyResult.data.comment,
        imageUrls
      );
      return ApiResponse.created({ review: toReviewData(review) });
    } catch (error) {
      if (error instanceof ImageUploadError) {
        return ApiResponse.error(error.message);
      }
      console.error("Error creating review:", error);
      return ApiResponse.serverError("レビューの投稿に失敗しました");
    }
  }

  /**
   * レビューを編集（認証必須・本人のみ、multipart/form-data）
   */
  async updateReview(reviewId: string): Promise<NextResponse> {
    if (!this.userId || !this.request) {
      return ApiResponse.unauthorized("認証が必要です");
    }

    const reviewResult = reviewIdSchema.safeParse({ reviewId });
    if (!reviewResult.success) {
      return ApiResponse.validationError(reviewResult.error);
    }

    // FormDataをパース
    let formData: FormData;
    try {
      formData = await this.request.formData();
    } catch {
      return ApiResponse.error("リクエストが不正です");
    }

    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;
    const images = (formData.getAll("images") as File[]).filter((img) => img.size > 0);
    const existingImageUrls = formData.getAll("existingImageUrls") as string[];

    // バリデーション（画像・合計枚数含む）
    const bodyResult = updateReviewSchema.safeParse({
      rating,
      comment,
      images: images.length > 0 ? images : undefined,
      existingImageUrls: existingImageUrls.length > 0 ? existingImageUrls : undefined,
    });
    if (!bodyResult.success) {
      return ApiResponse.validationError(bodyResult.error);
    }

    try {
      // レビューの存在確認と所有者チェック
      const existingReview = await this.repository.getReviewById(reviewResult.data.reviewId);
      if (!existingReview) {
        return ApiResponse.notFound("レビューが見つかりません");
      }
      if (existingReview.userId !== this.userId) {
        return ApiResponse.error("このレビューを編集する権限がありません", 403);
      }

      // 新しい画像をアップロード
      let newImageUrls: string[] = [];
      if (images.length > 0) {
        const uploadResults = await imageService.uploadMultiple(images, {
          subDir: "reviews",
        });
        newImageUrls = uploadResults.map((r) => r.publicUrl);
      }

      // 削除された画像を特定して削除
      const currentImageUrls = existingReview.images.map((img) => img.imageUrl);
      const deletedImageUrls = currentImageUrls.filter(
        (url) => !existingImageUrls.includes(url)
      );
      if (deletedImageUrls.length > 0) {
        await imageService.deleteMultiple(deletedImageUrls);
      }

      // 最終的な画像URL一覧
      const finalImageUrls = [...existingImageUrls, ...newImageUrls];

      const review = await this.repository.updateReview(reviewResult.data.reviewId, {
        rating: bodyResult.data.rating,
        comment: bodyResult.data.comment,
        imageUrls: finalImageUrls,
      });
      return ApiResponse.success({ review: toReviewData(review) });
    } catch (error) {
      if (error instanceof ImageUploadError) {
        return ApiResponse.error(error.message);
      }
      console.error("Error updating review:", error);
      return ApiResponse.serverError("レビューの更新に失敗しました");
    }
  }

  /**
   * レビューを削除（認証必須・本人のみ）
   */
  async deleteReview(reviewId: string): Promise<NextResponse> {
    if (!this.userId) {
      return ApiResponse.unauthorized("認証が必要です");
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
      if (existingReview.userId !== this.userId) {
        return ApiResponse.error("このレビューを削除する権限がありません", 403);
      }

      // 画像を削除
      if (existingReview.images.length > 0) {
        const imageUrls = existingReview.images.map((img) => img.imageUrl);
        await imageService.deleteMultiple(imageUrls);
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
