import type { RestaurantData } from "@/lib/types";
import { UtilApi, ApiError } from "@/lib/utilApi";

export interface IFrontendRestaurantRepository {
  getRestaurants(params?: { query?: string; tags?: string[] }): Promise<RestaurantData[]>;
  getRestaurant(id: string): Promise<RestaurantData | null>;
}

export class FrontendRestaurantRepository implements IFrontendRestaurantRepository {
  async getRestaurants(params?: { query?: string; tags?: string[] }): Promise<RestaurantData[]> {
    const searchParams = new URLSearchParams();

    if (params?.query) {
      searchParams.set("q", params.query);
    }
    if (params?.tags && params.tags.length > 0) {
      searchParams.set("tags", params.tags.join(","));
    }

    const baseUrl = UtilApi.buildUrl("/api/restaurants");
    const url = searchParams.toString() ? `${baseUrl}?${searchParams}` : baseUrl;

    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError("店舗一覧の取得に失敗しました", response.status);
    }

    const data = await response.json();
    return data.restaurants;
  }

  async getRestaurant(id: string): Promise<RestaurantData | null> {
    const response = await fetch(UtilApi.buildUrl(`/api/restaurants/${id}`));

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new ApiError("店舗情報の取得に失敗しました", response.status);
    }

    const data = await response.json();
    return data.restaurant;
  }
}

export const frontendRestaurantRepository = new FrontendRestaurantRepository();
