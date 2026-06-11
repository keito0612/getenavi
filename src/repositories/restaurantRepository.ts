import { prisma } from "@/lib/prisma";
import type { RestaurantWithRelations } from "@/lib/types";

export interface IRestaurantRepository {
  getRestaurants(query?: string, tagIds?: string[]): Promise<RestaurantWithRelations[]>;
  getRestaurant(id: string): Promise<RestaurantWithRelations | null>;
  getRestaurantsByBounds(
    north: number,
    south: number,
    east: number,
    west: number,
    query?: string,
    tagIds?: string[]
  ): Promise<RestaurantWithRelations[]>;
}

export class RestaurantRepository implements IRestaurantRepository {
  async getRestaurants(query?: string, tagIds?: string[]): Promise<RestaurantWithRelations[]> {
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

  async getRestaurant(id: string): Promise<RestaurantWithRelations | null> {
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
  ): Promise<RestaurantWithRelations[]> {
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
