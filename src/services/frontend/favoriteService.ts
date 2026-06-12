import {
  frontendFavoriteRepository,
  type IFrontendFavoriteRepository,
} from "@/repositories/frontend/favoriteRepository";
import type { RestaurantData } from "@/lib/types";

export class FrontendFavoriteService {
  constructor(private readonly repository: IFrontendFavoriteRepository) {}

  async getFavoriteRestaurants(token: string): Promise<RestaurantData[]> {
    return this.repository.getFavoriteRestaurants(token);
  }

  async addFavorite(token: string, restaurantId: string): Promise<void> {
    return this.repository.addFavorite(token, restaurantId);
  }

  async removeFavorite(token: string, restaurantId: string): Promise<void> {
    return this.repository.removeFavorite(token, restaurantId);
  }
}

export const frontendFavoriteService = new FrontendFavoriteService(
  frontendFavoriteRepository
);
