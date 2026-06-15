import { z } from "zod";

export const restaurantIdSchema = z.object({
  restaurantId: z
    .string({ error: "レストランIDは必須です" })
    .uuid({ error: "有効なレストランIDを指定してください" }),
});

export type RestaurantIdInput = z.infer<typeof restaurantIdSchema>;
