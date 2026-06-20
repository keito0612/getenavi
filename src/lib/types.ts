import type { Restaurant, Tag, BusinessHour } from "@prisma/client";

// ============================================
// User types
// ============================================

/** フロントエンド用ユーザーデータ */
export type UserData = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

/** 認証レスポンス（ログイン・新規登録時） */
export type AuthResponse = {
  user: UserData;
  token: string;
};

/** JWTトークンのペイロード */
export type TokenPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};

// ============================================
// UI types
// ============================================

/** モーダルの状態 */
export type ModalState = {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message?: string;
};

// ============================================
// Restaurant types
// ============================================

/** フロント側で使用する飲食店データ（タグ・営業時間を含む） */
export type RestaurantData = Restaurant & {
  tags: Tag[];
  businessHours: BusinessHour[];
};

/** 飲食店一覧レスポンス */
export type RestaurantListResponse = {
  restaurants: RestaurantData[];
};

/** タグ一覧レスポンス */
export type TagListResponse = {
  tags: Tag[];
};

/** 飲食店検索パラメータ */
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

// ============================================
// Constants
// ============================================

/** 曜日マッピング */
export const DAY_OF_WEEK = {
  0: "日曜日",
  1: "月曜日",
  2: "火曜日",
  3: "水曜日",
  4: "木曜日",
  5: "金曜日",
  6: "土曜日",
} as const;