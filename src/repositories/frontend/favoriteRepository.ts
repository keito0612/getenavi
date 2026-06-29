import type { RestaurantData } from "@/lib/types";
import { authFetch } from "@/lib/authFetch";
import { UtilApi, ApiError } from "@/lib/utilApi";

export interface IFrontendFavoriteRepository {
  getFavoriteRestaurants(): Promise<RestaurantData[]>;
  addFavorite(restaurantId: string): Promise<void>;
  removeFavorite(restaurantId: string): Promise<void>;
}

export class FrontendFavoriteRepository implements IFrontendFavoriteRepository {
  async getFavoriteRestaurants(): Promise<RestaurantData[]> {
    const response = await authFetch(UtilApi.buildUrl("/api/favorites"));

    if (!response.ok) {
      throw new ApiError("お気に入りの取得に失敗しました", response.status);
    }

    const data = await response.json();
    return data.restaurants;
  }

  async addFavorite(restaurantId: string): Promise<void> {
    const response = await authFetch(UtilApi.buildUrl(`/api/favorites/${restaurantId}`), {
      method: "POST",
    });

    if (!response.ok) {
      throw new ApiError("お気に入りの追加に失敗しました", response.status);
    }
  }

  async removeFavorite(restaurantId: string): Promise<void> {
    const response = await authFetch(UtilApi.buildUrl(`/api/favorites/${restaurantId}`), {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new ApiError("お気に入りの削除に失敗しました", response.status);
    }
  }
}

export const frontendFavoriteRepository = new FrontendFavoriteRepository();
