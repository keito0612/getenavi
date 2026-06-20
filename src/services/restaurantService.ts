import { NextRequest, NextResponse } from "next/server";
import { restaurantRepository, IRestaurantRepository } from "@/repositories/restaurantRepository";
import { restaurantSearchSchema } from "@/lib/validations/restaurant";
import { ApiResponse } from "@/lib/api";

export class RestaurantService {
  constructor(private readonly repository: IRestaurantRepository) { }

  async getRestaurants(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const params = {
        q: searchParams.get("q") ?? undefined,
        tags: searchParams.get("tags") ?? undefined,
        north: searchParams.get("north") ?? undefined,
        south: searchParams.get("south") ?? undefined,
        east: searchParams.get("east") ?? undefined,
        west: searchParams.get("west") ?? undefined,
      };

      const result = restaurantSearchSchema.safeParse(params);
      if (!result.success) {
        return ApiResponse.validationError(result.error);
      }

      const { q: query, tags: tagsParam, north, south, east, west } = result.data;
      const tags = tagsParam ? tagsParam.split(",") : undefined;

      let restaurants;
      if (north !== undefined && south !== undefined && east !== undefined && west !== undefined) {
        restaurants = await this.repository.getRestaurantsByBounds(north, south, east, west, query, tags);
      } else {
        restaurants = await this.repository.getRestaurants(query, tags);
      }

      return ApiResponse.success({ restaurants });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      return ApiResponse.serverError("飲食店の取得に失敗しました");
    }
  }

  async getRestaurant(id: string): Promise<NextResponse> {
    try {
      const restaurant = await this.repository.getRestaurant(id);
      if (!restaurant) {
        return ApiResponse.notFound("飲食店が見つかりません");
      }
      return ApiResponse.success({ restaurant });
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      return ApiResponse.serverError("飲食店の取得に失敗しました");
    }
  }
}

export const restaurantService = new RestaurantService(restaurantRepository);
