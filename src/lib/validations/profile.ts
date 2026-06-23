import { z } from "zod";

// ユーザー名の更新（Userテーブル）
export const updateNameSchema = z.object({
  name: z
    .string({ message: "名前は必須です" })
    .min(1, { message: "名前を入力してください" })
    .max(50, { message: "名前は50文字以内で入力してください" }),
});

// プロフィールの更新（Profileテーブル）
export const updateProfileSchema = z.object({
  comment: z
    .string()
    .max(300, { message: "自己紹介は300文字以内で入力してください" })
    .optional()
    .nullable(),
  backgroundImage: z
    .url({ message: "有効なURLを入力してください" })
    .optional()
    .nullable()
    .or(z.literal("")),
  avatarImage: z
    .url({ message: "有効なURLを入力してください" })
    .optional()
    .nullable()
    .or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: "現在のパスワードは必須です" })
      .min(1, { message: "現在のパスワードを入力してください" }),
    newPassword: z
      .string({ message: "新しいパスワードは必須です" })
      .min(8, { message: "パスワードは8文字以上で入力してください" }),
    confirmPassword: z
      .string({ message: "確認用パスワードは必須です" })
      .min(1, { message: "確認用パスワードを入力してください" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "新しいパスワードが一致しません",
    path: ["confirmPassword"],
  });

export type UpdateNameInput = z.infer<typeof updateNameSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
