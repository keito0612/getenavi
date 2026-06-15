import { NextRequest, NextResponse } from "next/server";
import { authRepository } from "@/repositories/authRepository";
import { UtilAuth } from "@/lib/auth";
import { EmailService } from "@/lib/email";
import { createToken } from "@/lib/auth/jwt";
import { registerSchema } from "@/lib/validations/auth";
import { ApiResponse } from "@/lib/api";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return ApiResponse.validationError(result.error);
  }

  try {
    const existingUser = await authRepository.findByEmail(result.data.email);
    if (existingUser) {
      return ApiResponse.error("このメールアドレスは既に登録されています");
    }

    const hashedPassword = await UtilAuth.hashPassword(result.data.password);
    const user = await authRepository.createUser({
      email: result.data.email,
      password: hashedPassword,
      name: result.data.name,
    });

    EmailService.sendWelcomeEmail(user.email, user.name).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    const token = await createToken({ userId: user.id, email: user.email });

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return ApiResponse.serverError();
  }
}
