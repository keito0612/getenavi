import { NextRequest } from "next/server";
import { reviewService } from "@/services/reviewService";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return reviewService.updateReview(request, id);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return reviewService.deleteReview(request, id);
}
