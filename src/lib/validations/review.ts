import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int({ message: "評価は整数で入力してください" })
    .min(1, { message: "評価は1以上で入力してください" })
    .max(5, { message: "評価は5以下で入力してください" }),
  comment: z
    .string()
    .min(1, { message: "コメントを入力してください" })
    .max(1000, { message: "コメントは1000文字以内で入力してください" }),
});

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int({ message: "評価は整数で入力してください" })
    .min(1, { message: "評価は1以上で入力してください" })
    .max(5, { message: "評価は5以下で入力してください" })
    .optional(),
  comment: z
    .string()
    .min(1, { message: "コメントを入力してください" })
    .max(1000, { message: "コメントは1000文字以内で入力してください" })
    .optional(),
});

export const reviewIdSchema = z.object({
  reviewId: z.string().uuid({ message: "無効なレビューIDです" }),
});

export const restaurantIdSchema = z.object({
  restaurantId: z.string().uuid({ message: "無効な飲食店IDです" }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
