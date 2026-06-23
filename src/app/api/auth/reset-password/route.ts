import { NextRequest } from "next/server";
import { authService } from "@/services/authService";

export async function POST(request: NextRequest) {
  return authService.resetPassword(request);
}
