import { prisma } from "@/lib/prisma";
import type { RestaurantData } from "@/lib/types";

export interface IRestaurantRepository {
  getRestaurants(query?: string, tagIds?: string[]): Promise<RestaurantData[]>;
  getRestaurant(id: string): Promise<RestaurantData | null>;
  getRestaurantsByBounds(
    north: number,
    south: number,
    east: number,
    west: number,
    query?: string,
    tagIds?: string[]
  ): Promise<RestaurantData[]>;
}

export class RestaurantRepository implements IRestaurantRepository {
  async getRestaurants(query?: string, tagIds?: string[]): Promise<RestaurantData[]> {
    return prisma.restaurant.findMany({
      where: {
        ...(query
          ? {
            OR: [
              {
                name: {
                  contains: query,
                }
              },
              { address: { contains: query } },
            ],
          }
          : {}),
        ...(tagIds?.length ? { tags: { some: { id: { in: tagIds } } } } : {}),
      },
      include: {
        tags: true,
        businessHours: { orderBy: { dayOfWeek: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getRestaurant(id: string): Promise<RestaurantData | null> {
    return prisma.restaurant.findUnique({
      where: { id },
      include: {
        tags: true,
        businessHours: { orderBy: { dayOfWeek: "asc" } },
      },
    });
  }

  async getRestaurantsByBounds(
    north: number,
    south: number,
    east: number,
    west: number,
    query?: string,
    tagIds?: string[]
  ): Promise<RestaurantData[]> {
    return prisma.restaurant.findMany({
      where: {
        latitude: { gte: south, lte: north },
        longitude: { gte: west, lte: east },
        ...(query
          ? {
            OR: [
              { name: { contains: query } },
              { address: { contains: query } },
            ],
          }
          : {}),
        ...(tagIds?.length ? { tags: { some: { id: { in: tagIds } } } } : {}),
      },
      include: {
        tags: true,
        businessHours: { orderBy: { dayOfWeek: "asc" } },
      },
    });
  }
}

export const restaurantRepository = new RestaurantRepository();
