import type { RestaurantData } from "@/lib/types";

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
    const response = await fetch(this.baseUrl, {
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "お気に入りの取得に失敗しました");
    }

    const data = await response.json();
    return data.restaurants;
  }

  async addFavorite(restaurantId: string): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId }),
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "お気に入りの追加に失敗しました");
    }
  }

  async removeFavorite(restaurantId: string): Promise<void> {
    const params = new URLSearchParams();
    params.set("restaurantId", restaurantId);

    const response = await fetch(`${this.baseUrl}?${params}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "お気に入りの削除に失敗しました");
    }
  }
}

export const frontendFavoriteRepository = new FrontendFavoriteRepository();
