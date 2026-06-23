import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "有効なメールアドレスを入力してください" }),
});

// サーバー側のバリデーション
export const resetPasswordSchema = z.object({
  token: z
    .string({ message: "トークンは必須です" })
    .min(1, { message: "トークンは必須です" }),
  password: z
    .string({ message: "パスワードを入力してください" })
    .min(8, { message: "パスワードは8文字以上で入力してください" }),
});

// フロントエンドのフォームバリデーション
export const resetPasswordFormSchema = z
  .object({
    password: z
      .string({ message: "パスワードを入力してください" })
      .min(8, { message: "パスワードは8文字以上で入力してください" }),
    confirmPassword: z
      .string({ message: "確認用パスワードを入力してください" })
      .min(1, { message: "確認用パスワードを入力してください" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
