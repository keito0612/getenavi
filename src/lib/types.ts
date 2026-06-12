import type { Restaurant, Tag, BusinessHour } from "@prisma/client";

// フロント側で使用する飲食店データ（タグ・営業時間を含む）
export type RestaurantData = Restaurant & {
  tags: Tag[];
  businessHours: BusinessHour[];
};

// API Response types
export type RestaurantListResponse = {
  restaurants: RestaurantData[];
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
