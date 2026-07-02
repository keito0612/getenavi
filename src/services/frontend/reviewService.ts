import {
  frontendReviewRepository,
  type IFrontendReviewRepository,
} from "@/repositories/frontend/reviewRepository";
import type { ReviewData, CreateReviewInput, UpdateReviewInput } from "@/lib/types";

export class FrontendReviewService {
  constructor(private readonly repository: IFrontendReviewRepository) {}

  async getReviews(restaurantId: string): Promise<ReviewData[]> {
    return this.repository.getReviews(restaurantId);
  }

  async createReview(restaurantId: string, data: CreateReviewInput): Promise<ReviewData> {
    return this.repository.createReview(restaurantId, data);
  }

  async updateReview(
    restaurantId: string,
    reviewId: string,
    data: UpdateReviewInput
  ): Promise<ReviewData> {
    return this.repository.updateReview(restaurantId, reviewId, data);
  }

  async deleteReview(restaurantId: string, reviewId: string): Promise<void> {
    return this.repository.deleteReview(restaurantId, reviewId);
  }
}

export const frontendReviewService = new FrontendReviewService(
  frontendReviewRepository
);
