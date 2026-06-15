import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string({ error: "名前は必須です" })
    .min(1, { error: "名前を入力してください" })
    .max(50, { error: "名前は50文字以内で入力してください" }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ error: "現在のパスワードは必須です" })
      .min(1, { error: "現在のパスワードを入力してください" }),
    newPassword: z
      .string({ error: "新しいパスワードは必須です" })
      .min(8, { error: "パスワードは8文字以上で入力してください" }),
    confirmPassword: z
      .string({ error: "確認用パスワードは必須です" })
      .min(1, { error: "確認用パスワードを入力してください" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "新しいパスワードが一致しません",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
