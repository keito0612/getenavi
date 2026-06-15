import {
  frontendFavoriteRepository,
  type IFrontendFavoriteRepository,
} from "@/repositories/frontend/favoriteRepository";
import type { RestaurantData } from "@/lib/types";

export class FrontendFavoriteService {
  constructor(private readonly repository: IFrontendFavoriteRepository) {}

  async getFavoriteRestaurants(): Promise<RestaurantData[]> {
    return this.repository.getFavoriteRestaurants();
  }

  async addFavorite(restaurantId: string): Promise<void> {
    return this.repository.addFavorite(restaurantId);
  }

  async removeFavorite(restaurantId: string): Promise<void> {
    return this.repository.removeFavorite(restaurantId);
  }
}

export const frontendFavoriteService = new FrontendFavoriteService(
  frontendFavoriteRepository
);
