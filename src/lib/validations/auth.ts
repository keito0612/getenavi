import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ error: "メールアドレスを入力してください。" })
    .email({ error: "有効なメールアドレスを入力してください" }),
  password: z
    .string({ error: "パスワードを入力してください。" })
    .min(8, { error: "パスワードは8文字以上で入力してください" }),
  name: z
    .string({ error: "名前は必須です" })
    .min(1, { error: "名前を入力してください" }),
});

export const loginSchema = z.object({
  email: z
    .string({ error: "メールアドレスは必須です" })
    .email({ error: "有効なメールアドレスを入力してください" }),
  password: z
    .string({ error: "パスワードは必須です" })
    .min(1, { error: "パスワードを入力してください" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
