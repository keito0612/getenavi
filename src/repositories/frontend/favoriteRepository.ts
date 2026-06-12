import type { RestaurantData } from "@/lib/types";

export interface IFrontendFavoriteRepository {
  getFavoriteRestaurants(token: string): Promise<RestaurantData[]>;
  addFavorite(token: string, restaurantId: string): Promise<void>;
  removeFavorite(token: string, restaurantId: string): Promise<void>;
}

export class FrontendFavoriteRepository implements IFrontendFavoriteRepository {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/favorites") {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(token: string): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getFavoriteRestaurants(token: string): Promise<RestaurantData[]> {
    const response = await fetch(this.baseUrl, {
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "お気に入りの取得に失敗しました");
    }

    const data = await response.json();
    return data.restaurants;
  }

  async addFavorite(token: string, restaurantId: string): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ restaurantId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "お気に入りの追加に失敗しました");
    }
  }

  async removeFavorite(token: string, restaurantId: string): Promise<void> {
    const params = new URLSearchParams();
    params.set("restaurantId", restaurantId);

    const response = await fetch(`${this.baseUrl}?${params}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "お気に入りの削除に失敗しました");
    }
  }
}

export const frontendFavoriteRepository = new FrontendFavoriteRepository();
