import type { Restaurant, Tag, BusinessHour } from "@prisma/client";

// Restaurant with relations
export type RestaurantWithRelations = Restaurant & {
  tags: Tag[];
  businessHours: BusinessHour[];
};

// API Response types
export type RestaurantListResponse = {
  restaurants: RestaurantWithRelations[];
};

export type TagListResponse = {
  tags: Tag[];
};

// Query params
export type RestaurantQueryParams = {
  query?: string;
  tags?: string[];
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
};

// Day of week mapping
export const DAY_OF_WEEK = {
  0: "日曜日",
  1: "月曜日",
  2: "火曜日",
  3: "水曜日",
  4: "木曜日",
  5: "金曜日",
  6: "土曜日",
} as const;
