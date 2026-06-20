import { z } from "zod";

export const restaurantSearchSchema = z.object({
  q: z.string().optional(),
  tags: z.string().optional(),
  north: z.coerce.number().optional(),
  south: z.coerce.number().optional(),
  east: z.coerce.number().optional(),
  west: z.coerce.number().optional(),
}).refine(
  (data) => {
    const boundsFields = [data.north, data.south, data.east, data.west];
    const hasAnyBounds = boundsFields.some((f) => f !== undefined);
    const hasAllBounds = boundsFields.every((f) => f !== undefined);
    return !hasAnyBounds || hasAllBounds;
  },
  { message: "地図範囲を指定する場合は、north, south, east, westすべてを指定してください" }
);

export type RestaurantSearchInput = z.infer<typeof restaurantSearchSchema>;
