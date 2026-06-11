import { restaurantRepository, IRestaurantRepository } from "@/repositories/restaurantRepository";
import type { RestaurantWithRelations, RestaurantQueryParams } from "@/lib/types";

export class RestaurantService {
  constructor(private readonly repository: IRestaurantRepository) {}

  async getRestaurants(params?: RestaurantQueryParams): Promise<RestaurantWithRelations[]> {
    if (params?.bounds) {
      const { north, south, east, west } = params.bounds;
      return this.repository.getRestaurantsByBounds(north, south, east, west, params.query, params.tags);
    }
    return this.repository.getRestaurants(params?.query, params?.tags);
  }

  async getRestaurant(id: string): Promise<RestaurantWithRelations | null> {
    return this.repository.getRestaurant(id);
  }
}

export const restaurantService = new RestaurantService(restaurantRepository);
