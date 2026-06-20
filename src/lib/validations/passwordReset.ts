import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "有効なメールアドレスを入力してください" }),
});

export const resetPasswordSchema = z.object({
  token: z
    .string({ message: "トークンは必須です" })
    .min(1, { message: "トークンは必須です" }),
  password: z
    .string({ message: "パスワードを入力してください" })
    .min(8, { message: "パスワードは8文字以上で入力してください" }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
