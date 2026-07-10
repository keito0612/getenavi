import { prisma } from "@/lib/prisma";
import type { RestaurantData } from "@/lib/types";

type RestaurantWithReviews = Awaited<ReturnType<typeof prisma.restaurant.findFirst<{
  include: {
    tags: true;
    businessHours: true;
    reviews: {
      select: {
        dangerLevel: true;
        images: { select: { imageUrl: true }; take: 1 };
      };
    };
  };
}>>>;

function toRestaurantData(restaurant: NonNullable<RestaurantWithReviews>): RestaurantData {
  const reviews = restaurant.reviews || [];
  const reviewAverageDangerLevel = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.dangerLevel, 0) / reviews.length
    : 0;

  // レビューの最初の画像を取得
  const firstReviewImageUrl = reviews
    .flatMap((r) => r.images)
    .map((img) => img.imageUrl)[0] || null;

  return {
    id: restaurant.id,
    name: restaurant.name,
    address: restaurant.address,
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
    url: restaurant.url,
    dangerLevel: restaurant.dangerLevel,
    reviewAverageDangerLevel,
    firstReviewImageUrl,
    description: restaurant.description,
    imageUrl: restaurant.imageUrl,
    createdAt: restaurant.createdAt,
    updatedAt: restaurant.updatedAt,
    tags: restaurant.tags,
    businessHours: restaurant.businessHours,
  };
}

export interface IRestaurantRepository {
  getRestaurants(query?: string, tagIds?: number[]): Promise<RestaurantData[]>;
  getRestaurant(id: string): Promise<RestaurantData | null>;
  getRestaurantsByBounds(
    north: number,
    south: number,
    east: number,
    west: number,
    query?: string,
    tagIds?: number[]
  ): Promise<RestaurantData[]>;
}

const restaurantInclude = {
  tags: true,
  businessHours: { orderBy: { dayOfWeek: "asc" } as const },
  reviews: {
    select: {
      dangerLevel: true,
      images: {
        select: { imageUrl: true },
        take: 1,
      },
    },
  },
};

export class RestaurantRepository implements IRestaurantRepository {
  async getRestaurants(query?: string, tagIds?: number[]): Promise<RestaurantData[]> {
    const restaurants = await prisma.restaurant.findMany({
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
      include: restaurantInclude,
      orderBy: { createdAt: "desc" },
    });
    return restaurants.map(toRestaurantData);
  }

  async getRestaurant(id: string): Promise<RestaurantData | null> {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: restaurantInclude,
    });
    return restaurant ? toRestaurantData(restaurant) : null;
  }

  async getRestaurantsByBounds(
    north: number,
    south: number,
    east: number,
    west: number,
    query?: string,
    tagIds?: number[]
  ): Promise<RestaurantData[]> {
    const restaurants = await prisma.restaurant.findMany({
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
      include: restaurantInclude,
    });
    return restaurants.map(toRestaurantData);
  }
}

export const restaurantRepository = new RestaurantRepository();
