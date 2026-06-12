import { NextRequest, NextResponse } from "next/server";
import { passwordResetService } from "@/services/passwordResetService";
import { forgotPasswordSchema } from "@/lib/validations/passwordReset";
import { EmailService } from "@/lib/email";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return NextResponse.json(
        { error: firstIssue.message },
        { status: 400 }
      );
    }

    const token = await passwordResetService.requestPasswordReset(result.data.email);

    if (token) {
      // パスワードリセットメールを送信（非同期で送信、エラーは無視）
      EmailService.sendPasswordResetEmail(result.data.email, token).catch((error) => {
        console.error("Failed to send password reset email:", error);
      });
    }

    // セキュリティ: ユーザーが存在しない場合も同じレスポンスを返す
    return NextResponse.json({
      message: "メールアドレスが登録されている場合、パスワードリセット用のメールを送信しました",
    });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return NextResponse.json(
      { error: "パスワードリセットのリクエストに失敗しました" },
      { status: 500 }
    );
  }
}
