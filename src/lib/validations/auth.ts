import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email({ message: "有効なメールアドレスを入力してください" }),
    password: z
      .string({ message: "パスワードを入力してください" })
      .min(8, { message: "パスワードは8文字以上で入力してください" }),
    confirmPassword: z
      .string({ message: "確認用パスワードを入力してください" })
      .min(1, { message: "確認用パスワードを入力してください" }),
    name: z
      .string({ message: "名前は必須です" })
      .min(1, { message: "名前を入力してください" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email({ message: "有効なメールアドレスを入力してください" }),
  password: z
    .string({ message: "パスワードは必須です" })
    .min(1, { message: "パスワードを入力してください" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
