import { NextRequest } from "next/server";
import { authService } from "@/services/authService";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return authService.resetPassword(body);
}
