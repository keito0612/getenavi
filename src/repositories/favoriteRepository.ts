import { prisma } from "@/lib/prisma";
import type { RestaurantData } from "@/lib/types";

export interface IFavoriteRepository {
  getFavoriteRestaurants(userId: string): Promise<RestaurantData[]>;
  addFavorite(userId: string, restaurantId: string): Promise<void>;
  removeFavorite(userId: string, restaurantId: string): Promise<void>;
  isFavorite(userId: string, restaurantId: string): Promise<boolean>;
}

export class FavoriteRepository implements IFavoriteRepository {
  async getFavoriteRestaurants(userId: string): Promise<RestaurantData[]> {
    const favorites = await prisma.favoriteRestaurant.findMany({
      where: { userId },
      include: {
        restaurant: {
          include: {
            tags: true,
            businessHours: { orderBy: { dayOfWeek: "asc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const favoriteseRestaurants = favorites.map((fav) => fav.restaurant) as RestaurantData[];
    return favoriteseRestaurants;
  }

  async addFavorite(userId: string, restaurantId: string): Promise<void> {
    await prisma.favoriteRestaurant.create({
      data: { userId, restaurantId },
    });
  }

  async removeFavorite(userId: string, restaurantId: string): Promise<void> {
    await prisma.favoriteRestaurant.delete({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
    });
  }

  async isFavorite(userId: string, restaurantId: string): Promise<boolean> {
    const favorite = await prisma.favoriteRestaurant.findUnique({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
    });
    return favorite !== null;
  }
}

export const favoriteRepository = new FavoriteRepository();
