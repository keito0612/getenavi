import { z } from "zod";

// ============================================
// 定数
// ============================================

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_IMAGES = 4;

// ============================================
// 画像バリデーション
// ============================================

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE_BYTES, {
    message: `ファイルサイズは${MAX_FILE_SIZE_MB}MB以下にしてください`,
  })
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
    message: `対応していないファイル形式です（${ALLOWED_IMAGE_TYPES.map((t) => t.split("/")[1]).join(", ")}のみ）`,
  });

const imageFilesSchema = z
  .array(imageFileSchema)
  .max(MAX_IMAGES, { message: `画像は最大${MAX_IMAGES}枚までです` });

// ============================================
// レビューバリデーション
// ============================================

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int({ message: "評価は整数で入力してください" })
    .min(1, { message: "評価は1以上で入力してください" })
    .max(5, { message: "評価は5以下で入力してください" }),
  dangerLevel: z
    .number()
    .int({ message: "珍食レベルは整数で入力してください" })
    .min(1, { message: "珍食レベルは1以上で入力してください" })
    .max(5, { message: "珍食レベルは5以下で入力してください" }),
  comment: z
    .string()
    .min(1, { message: "コメントを入力してください" })
    .max(300, { message: "コメントは300文字以内で入力してください" }),
  images: imageFilesSchema.optional(),
});

export const updateReviewSchema = z
  .object({
    rating: z
      .number()
      .int({ message: "評価は整数で入力してください" })
      .min(1, { message: "評価は1以上で入力してください" })
      .max(5, { message: "評価は5以下で入力してください" }),
    dangerLevel: z
      .number()
      .int({ message: "珍食レベルは整数で入力してください" })
      .min(1, { message: "珍食レベルは1以上で入力してください" })
      .max(5, { message: "珍食レベルは5以下で入力してください" }),
    comment: z
      .string()
      .min(1, { message: "コメントを入力してください" })
      .max(300, { message: "コメントは300文字以内で入力してください" }),
    images: imageFilesSchema.optional(),
    existingImageUrls: z.array(z.string()).optional(),
  })
  .refine(
    (data) => (data.images?.length ?? 0) + (data.existingImageUrls?.length ?? 0) <= MAX_IMAGES,
    { message: `画像は合計${MAX_IMAGES}枚までです` }
  );

export const reviewIdSchema = z.object({
  reviewId: z.string().uuid({ message: "無効なレビューIDです" }),
});

export const restaurantIdSchema = z.object({
  restaurantId: z.string().uuid({ message: "無効な飲食店IDです" }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
