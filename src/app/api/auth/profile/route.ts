import { NextRequest } from "next/server";
import { authService } from "@/services/authService";
import { ApiResponse } from "@/lib/api";

export const runtime = "edge";

export async function PATCH(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return ApiResponse.unauthorized();
  }

  const body = await request.json();
  return authService.updateProfile(userId, body);
}
