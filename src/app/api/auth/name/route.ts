import { NextRequest } from "next/server";
import { authService } from "@/services/authService";

export async function PATCH(request: NextRequest) {
  return authService.updateName(request);
}
