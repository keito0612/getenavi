export type FieldErrors = Record<string, string>;

export class ValidationError extends Error {
  public readonly fieldErrors: FieldErrors;
  public readonly status: number;

  constructor(fieldErrors: FieldErrors, status: number = 400) {
    const firstError = Object.values(fieldErrors)[0] || "バリデーションエラー";
    super(firstError);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}
