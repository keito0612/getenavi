import { prisma } from "@/lib/prisma";

export type ReviewImage = {
  id: string;
  imageUrl: string;
  order: number;
};

export type ReviewWithUser = {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number;
  dangerLevel: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  images: ReviewImage[];
};

export interface IReviewRepository {
  getReviewsByRestaurantId(restaurantId: string): Promise<ReviewWithUser[]>;
  getReviewById(id: string): Promise<ReviewWithUser | null>;
  getReviewByUserAndRestaurant(userId: string, restaurantId: string): Promise<ReviewWithUser | null>;
  createReview(
    userId: string,
    restaurantId: string,
    rating: number,
    dangerLevel: number,
    comment: string,
    imageUrls?: string[]
  ): Promise<ReviewWithUser>;
  updateReview(
    id: string,
    data: { rating?: number; dangerLevel?: number; comment?: string; imageUrls?: string[] }
  ): Promise<ReviewWithUser>;
  deleteReview(id: string): Promise<void>;
}

const reviewInclude = {
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  images: {
    select: {
      id: true,
      imageUrl: true,
      order: true,
    },
    orderBy: { order: "asc" as const },
  },
};

export class ReviewRepository implements IReviewRepository {
  async getReviewsByRestaurantId(restaurantId: string): Promise<ReviewWithUser[]> {
    return prisma.review.findMany({
      where: { restaurantId },
      include: reviewInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async getReviewById(id: string): Promise<ReviewWithUser | null> {
    return prisma.review.findUnique({
      where: { id },
      include: reviewInclude,
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
      include: reviewInclude,
    });
  }

  async createReview(
    userId: string,
    restaurantId: string,
    rating: number,
    dangerLevel: number,
    comment: string,
    imageUrls?: string[]
  ): Promise<ReviewWithUser> {
    return prisma.review.create({
      data: {
        userId,
        restaurantId,
        rating,
        dangerLevel,
        comment,
        images: imageUrls?.length
          ? {
              create: imageUrls.map((url, index) => ({
                imageUrl: url,
                order: index,
              })),
            }
          : undefined,
      },
      include: reviewInclude,
    });
  }

  async updateReview(
    id: string,
    data: { rating?: number; dangerLevel?: number; comment?: string; imageUrls?: string[] }
  ): Promise<ReviewWithUser> {
    const { imageUrls, ...reviewData } = data;

    // 画像の更新がある場合は、既存の画像を削除して新規作成
    if (imageUrls !== undefined) {
      await prisma.reviewImage.deleteMany({
        where: { reviewId: id },
      });

      if (imageUrls.length > 0) {
        await prisma.reviewImage.createMany({
          data: imageUrls.map((url, index) => ({
            reviewId: id,
            imageUrl: url,
            order: index,
          })),
        });
      }
    }

    return prisma.review.update({
      where: { id },
      data: reviewData,
      include: reviewInclude,
    });
  }

  async deleteReview(id: string): Promise<void> {
    await prisma.review.delete({
      where: { id },
    });
  }
}

export const reviewRepository = new ReviewRepository();
