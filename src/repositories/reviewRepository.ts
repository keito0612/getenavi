import { prisma } from "@/lib/prisma";

export type ReviewWithUser = {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
};

export interface IReviewRepository {
  getReviewsByRestaurantId(restaurantId: string): Promise<ReviewWithUser[]>;
  getReviewById(id: string): Promise<ReviewWithUser | null>;
  getReviewByUserAndRestaurant(userId: string, restaurantId: string): Promise<ReviewWithUser | null>;
  createReview(
    userId: string,
    restaurantId: string,
    rating: number,
    comment: string
  ): Promise<ReviewWithUser>;
  updateReview(id: string, data: { rating?: number; comment?: string }): Promise<ReviewWithUser>;
  deleteReview(id: string): Promise<void>;
}

export class ReviewRepository implements IReviewRepository {
  async getReviewsByRestaurantId(restaurantId: string): Promise<ReviewWithUser[]> {
    return prisma.review.findMany({
      where: { restaurantId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getReviewById(id: string): Promise<ReviewWithUser | null> {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async getReviewByUserAndRestaurant(
    userId: string,
    restaurantId: string
  ): Promise<ReviewWithUser | null> {
    return prisma.review.findUnique({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async createReview(
    userId: string,
    restaurantId: string,
    rating: number,
    comment: string
  ): Promise<ReviewWithUser> {
    return prisma.review.create({
      data: {
        userId,
        restaurantId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async updateReview(
    id: string,
    data: { rating?: number; comment?: string }
  ): Promise<ReviewWithUser> {
    return prisma.review.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async deleteReview(id: string): Promise<void> {
    await prisma.review.delete({
      where: { id },
    });
  }
}

export const reviewRepository = new ReviewRepository();
