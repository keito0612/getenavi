import { NextRequest } from "next/server";
import { reviewService } from "@/services/reviewService";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return reviewService.getReviews(request, id);
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return reviewService.createReview(request, id);
}
