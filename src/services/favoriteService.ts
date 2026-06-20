import { NextRequest, NextResponse } from "next/server";
import { favoriteRepository, IFavoriteRepository } from "@/repositories/favoriteRepository";
import { restaurantIdSchema } from "@/lib/validations/favorite";
import { ApiResponse } from "@/lib/api";
import { verifyBearerToken } from "@/lib/auth/verifyToken";

export class FavoriteService {
  constructor(private readonly repository: IFavoriteRepository) {}

  /**
   * Bearer tokenからユーザーIDを取得
   */
  private async getUserIdFromToken(request: NextRequest): Promise<string | null> {
    const result = await verifyBearerToken(request.headers);
    return result?.userId ?? null;
  }

  async getFavorites(request: NextRequest): Promise<NextResponse> {
    const userId = await this.getUserIdFromToken(request);
    if (!userId) {
      return ApiResponse.unauthorized();
    }

    try {
      const restaurants = await this.repository.getFavoriteRestaurants(userId);
      return ApiResponse.success({ restaurants });
    } catch (error) {
      console.error("Error fetching favorite restaurants:", error);
      return ApiResponse.serverError("お気に入りの取得に失敗しました");
    }
  }

  async addFavorite(request: NextRequest): Promise<NextResponse> {
    const userId = await this.getUserIdFromToken(request);
    if (!userId) {
      return ApiResponse.unauthorized();
    }

    try {
      const body = await request.json();
      const result = restaurantIdSchema.safeParse(body);
      if (!result.success) {
        return ApiResponse.validationError(result.error);
      }

      await this.repository.addFavorite(userId, result.data.restaurantId);
      return ApiResponse.created({ success: true });
    } catch (error) {
      console.error("Error adding favorite:", error);
      return ApiResponse.serverError("お気に入りの追加に失敗しました");
    }
  }

  async removeFavorite(request: NextRequest): Promise<NextResponse> {
    const userId = await this.getUserIdFromToken(request);
    if (!userId) {
      return ApiResponse.unauthorized();
    }

    try {
      const { searchParams } = new URL(request.url);
      const restaurantId = searchParams.get("restaurantId");

      const result = restaurantIdSchema.safeParse({ restaurantId });
      if (!result.success) {
        return ApiResponse.validationError(result.error);
      }

      await this.repository.removeFavorite(userId, result.data.restaurantId);
      return ApiResponse.success({ success: true });
    } catch (error) {
      console.error("Error removing favorite:", error);
      return ApiResponse.serverError("お気に入りの削除に失敗しました");
    }
  }

  async isFavorite(userId: string, restaurantId: string): Promise<boolean> {
    return this.repository.isFavorite(userId, restaurantId);
  }
}

export const favoriteService = new FavoriteService(favoriteRepository);
