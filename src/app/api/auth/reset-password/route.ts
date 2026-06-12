import { NextRequest, NextResponse } from "next/server";
import { passwordResetService } from "@/services/passwordResetService";
import { resetPasswordSchema } from "@/lib/validations/passwordReset";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return NextResponse.json(
        { error: firstIssue.message },
        { status: 400 }
      );
    }

    const success = await passwordResetService.resetPassword(
      result.data.token,
      result.data.password
    );

    if (!success) {
      return NextResponse.json(
        { error: "無効または期限切れのトークンです" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "パスワードが正常にリセットされました",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "パスワードのリセットに失敗しました" },
      { status: 500 }
    );
  }
}
