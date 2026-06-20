import { NextRequest } from "next/server";
import { verifyBearerToken } from "@/lib/auth/verifyToken";
import { authService } from "@/services/authService";
import { ApiResponse } from "@/lib/api";

export async function PATCH(request: NextRequest) {
  const result = await verifyBearerToken(request.headers);

  if (!result) {
    return ApiResponse.unauthorized();
  }

  const body = await request.json();
  return authService.changePassword(result.userId, body);
}
