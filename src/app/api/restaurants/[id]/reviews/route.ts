import { NextRequest } from "next/server";
import { reviewService, ReviewService } from "@/services/reviewService";
import { ApiResponse } from "@/lib/api";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  return reviewService.getReviews(id);
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const service = await ReviewService.withAuth(request);
    return service.createReview(id);
  } catch {
    return ApiResponse.unauthorized("認証が必要です");
  }
}
