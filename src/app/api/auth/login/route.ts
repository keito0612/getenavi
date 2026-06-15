import { NextRequest, NextResponse } from "next/server";
import { authRepository } from "@/repositories/authRepository";
import { UtilAuth } from "@/lib/auth";
import { createToken } from "@/lib/auth/jwt";
import { loginSchema } from "@/lib/validations/auth";
import { ApiResponse } from "@/lib/api";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return ApiResponse.validationError(result.error);
  }

  try {
    const user = await authRepository.findByEmail(result.data.email);
    if (!user) {
      return ApiResponse.unauthorized("メールアドレスまたはパスワードが正しくありません");
    }

    const isValid = await UtilAuth.verifyPassword(result.data.password, user.password);
    if (!isValid) {
      return ApiResponse.unauthorized("メールアドレスまたはパスワードが正しくありません");
    }

    const token = await createToken({ userId: user.id, email: user.email });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return ApiResponse.serverError();
  }
}
