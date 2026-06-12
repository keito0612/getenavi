import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string({ error: "メールアドレスを入力してください" })
    .email({ error: "有効なメールアドレスを入力してください" }),
});

export const resetPasswordSchema = z.object({
  token: z
    .string({ error: "トークンは必須です" })
    .min(1, { error: "トークンは必須です" }),
  password: z
    .string({ error: "パスワードを入力してください" })
    .min(8, { error: "パスワードは8文字以上で入力してください" }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
