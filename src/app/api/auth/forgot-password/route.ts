import { NextRequest } from "next/server";
import { authService } from "@/services/authService";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return authService.forgotPassword(body);
}
