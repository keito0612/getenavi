import type { RestaurantData } from "@/lib/types";
import { authFetch } from "@/lib/authFetch";

export interface IFrontendFavoriteRepository {
  getFavoriteRestaurants(): Promise<RestaurantData[]>;
  addFavorite(restaurantId: string): Promise<void>;
  removeFavorite(restaurantId: string): Promise<void>;
}

export class FrontendFavoriteRepository implements IFrontendFavoriteRepository {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/favorites") {
    this.baseUrl = baseUrl;
  }

  async getFavoriteRestaurants(): Promise<RestaurantData[]> {
    const response = await authFetch(this.baseUrl);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "お気に入りの取得に失敗しました");
    }

    const data = await response.json();
    return data.restaurants;
  }

  async addFavorite(restaurantId: string): Promise<void> {
    const response = await authFetch(this.baseUrl, {
      method: "POST",
      body: JSON.stringify({ restaurantId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "お気に入りの追加に失敗しました");
    }
  }

  async removeFavorite(restaurantId: string): Promise<void> {
    const params = new URLSearchParams();
    params.set("restaurantId", restaurantId);

    const response = await authFetch(`${this.baseUrl}?${params}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "お気に入りの削除に失敗しました");
    }
  }
}

export const frontendFavoriteRepository = new FrontendFavoriteRepository();
