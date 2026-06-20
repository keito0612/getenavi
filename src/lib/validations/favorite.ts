import { z } from "zod";

export const restaurantIdSchema = z.object({
  restaurantId: z
    .string({ message: "飲食店IDは必須です" })
    .uuid({ message: "有効な飲食店IDを指定してください" }),
});

export type RestaurantIdInput = z.infer<typeof restaurantIdSchema>;
