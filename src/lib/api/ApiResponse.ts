import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export class ApiResponse {
  static success<T>(data: T, status: number = 200) {
    return NextResponse.json(data, { status: status });
  }

  static created<T>(data: T) {
    return NextResponse.json(data, { status: 201 });
  }

  static error(message: string, status: number = 400) {
    return NextResponse.json({ error: message }, { status: status });
  }

  /**
   * 特定フィールドのエラー
   */
  static fieldError(field: string, message: string, status: number = 400) {
    return NextResponse.json(
      { errors: { [field]: message } },
      { status }
    );
  }

  /**
   * Zodバリデーションエラー
   * フィールド名をキーとしたエラーメッセージのオブジェクトを返す
   */
  static validationError(zodError: ZodError) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of zodError.issues) {
      const field = issue.path.join(".");
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    return NextResponse.json(
      { errors: fieldErrors },
      { status: 400 }
    );
  }

  static unauthorized(message: string = "認証が必要です") {
    return NextResponse.json({ error: message }, { status: 401 });
  }

  static notFound(message: string = "見つかりません") {
    return NextResponse.json({ error: message }, { status: 404 });
  }

  static serverError(message: string = "サーバー側で、エラー発生しました") {
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
