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

/** 認証検証結果 */
export type AuthResult = {
  userId: string;
  user: UserData;
} | null;

// ============================================
// Profile types
// ============================================

/** フロントエンド用プロフィールデータ */
export type ProfileData = {
  id: string;
  userId: string;
  comment: string | null;
  backgroundImage: string | null;
  avatarImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: Pick<UserData, "id" | "name" | "email">;
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
// Tag types
// ============================================

/** タグデータ */
export type TagData = {
  id: string;
  name: string;
  emoji: string | null;
  createdAt: Date;
};

// ============================================
// BusinessHour types
// ============================================

/** 営業時間データ */
export type BusinessHourData = {
  id: string;
  restaurantId: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
};

// ============================================
// Restaurant types
// ============================================

/** フロント側で使用する飲食店データ（タグ・営業時間を含む） */
export type RestaurantData = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  url: string | null;
  dangerLevel: number;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: TagData[];
  businessHours: BusinessHourData[];
};

/** 飲食店一覧レスポンス */
export type RestaurantListResponse = {
  restaurants: RestaurantData[];
};

/** タグ一覧レスポンス */
export type TagListResponse = {
  tags: TagData[];
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

// ============================================
// Review types
// ============================================

/** レビューデータ */
export type ReviewData = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
};

/** レビュー一覧レスポンス */
export type ReviewListResponse = {
  reviews: ReviewData[];
};

/** レビュー投稿リクエスト */
export type CreateReviewInput = {
  rating: number;
  comment: string;
};

/** レビュー更新リクエスト */
export type UpdateReviewInput = {
  rating?: number;
  comment?: string;
};