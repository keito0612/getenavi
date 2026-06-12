import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/authService";
import { loginSchema } from "@/lib/validations/auth";
import { createToken } from "@/lib/auth/jwt";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return NextResponse.json(
        { error: firstIssue.message },
        { status: 400 }
      );
    }

    const user = await authService.login(result.data.email, result.data.password);
    const token = await createToken({ userId: user.id, email: user.email });

    return NextResponse.json({ user, token });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "ログインに失敗しました" },
      { status: 500 }
    );
  }
}
