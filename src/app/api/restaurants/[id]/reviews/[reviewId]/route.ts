import { NextRequest } from "next/server";
import { ReviewService, reviewService } from "@/services/reviewService";
import { ReviewRepository } from "@/repositories/reviewRepository";
import { ApiError } from "@/lib/utilApi";
import { ApiResponse } from "@/lib/api";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string; reviewId: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  const { reviewId } = await params;
  try {
    const service = await ReviewService.withAuth(request);
    return service.updateReview(reviewId);
  } catch {
    return ApiResponse.unauthorized("認証が必要です");
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { reviewId } = await params;
  try {
    const service = await ReviewService.withAuth(request);
    return service.deleteReview(reviewId);
  } catch {
    return ApiResponse.unauthorized("認証が必要です");
  }
}
