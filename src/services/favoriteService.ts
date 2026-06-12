import { favoriteRepository, IFavoriteRepository } from "@/repositories/favoriteRepository";
import type { RestaurantData } from "@/lib/types";

export class FavoriteService {
  constructor(private readonly repository: IFavoriteRepository) {}

  async getFavoriteRestaurants(userId: string): Promise<RestaurantData[]> {
    return this.repository.getFavoriteRestaurants(userId);
  }

  async addFavorite(userId: string, restaurantId: string): Promise<void> {
    return this.repository.addFavorite(userId, restaurantId);
  }

  async removeFavorite(userId: string, restaurantId: string): Promise<void> {
    return this.repository.removeFavorite(userId, restaurantId);
  }

  async isFavorite(userId: string, restaurantId: string): Promise<boolean> {
    return this.repository.isFavorite(userId, restaurantId);
  }
}

export const favoriteService = new FavoriteService(favoriteRepository);
