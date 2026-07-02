/**
 * APIエラークラス
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class UtilApi {
  static getBaseUrl(): string {
    if (typeof window === "undefined") {
      return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    }
    return "";
  }

  static buildUrl(path: string): string {
    return `${this.getBaseUrl()}${path}`;
  }
  static handleError(
    error: unknown,
    handlers: Partial<Record<number | "default", () => void>>
  ): void {
    const err = error as ApiError;
    const status = err.status || 500;

    // 対応するハンドラーがあれば実行、なければdefault
    if (handlers[status]) {
      handlers[status]();
    } else if (handlers.default) {
      handlers.default();
    }
  }
}
