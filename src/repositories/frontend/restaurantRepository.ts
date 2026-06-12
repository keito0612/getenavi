import type { RestaurantData } from "@/lib/types";

export interface IFrontendRestaurantRepository {
  getRestaurants(params?: { query?: string; tags?: string[] }): Promise<RestaurantData[]>;
  getRestaurant(id: string): Promise<RestaurantData | null>;
}

export class FrontendRestaurantRepository implements IFrontendRestaurantRepository {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/restaurants") {
    this.baseUrl = baseUrl;
  }

  async getRestaurants(params?: { query?: string; tags?: string[] }): Promise<RestaurantData[]> {
    const searchParams = new URLSearchParams();

    if (params?.query) {
      searchParams.set("q", params.query);
    }
    if (params?.tags && params.tags.length > 0) {
      searchParams.set("tags", params.tags.join(","));
    }

    const url = searchParams.toString()
      ? `${this.baseUrl}?${searchParams}`
      : this.baseUrl;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch restaurants");
    }

    const data = await response.json();
    return data.restaurants;
  }

  async getRestaurant(id: string): Promise<RestaurantData | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch restaurant");
    }

    const data = await response.json();
    return data.restaurant;
  }
}

export const frontendRestaurantRepository = new FrontendRestaurantRepository();
