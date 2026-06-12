import { z } from "zod";

export const getFavoritesSchema = z.object({
  userId: z
    .string({ error: "ユーザーIDは必須です" })
    .uuid({ error: "有効なユーザーIDを指定してください" }),
});

export const addFavoriteSchema = z.object({
  userId: z
    .string({ error: "ユーザーIDは必須です" })
    .uuid({ error: "有効なユーザーIDを指定してください" }),
  restaurantId: z
    .string({ error: "レストランIDは必須です" })
    .uuid({ error: "有効なレストランIDを指定してください" }),
});

export const removeFavoriteSchema = z.object({
  userId: z
    .string({ error: "ユーザーIDは必須です" })
    .uuid({ error: "有効なユーザーIDを指定してください" }),
  restaurantId: z
    .string({ error: "レストランIDは必須です" })
    .uuid({ error: "有効なレストランIDを指定してください" }),
});

export type GetFavoritesInput = z.infer<typeof getFavoritesSchema>;
export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;
export type RemoveFavoriteInput = z.infer<typeof removeFavoriteSchema>;
