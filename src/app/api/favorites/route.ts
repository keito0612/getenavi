import { NextRequest, NextResponse } from "next/server";
import { favoriteService } from "@/services/favoriteService";
import { z } from "zod";

export const runtime = "edge";

const restaurantIdSchema = z.object({
  restaurantId: z
    .string({ error: "レストランIDは必須です" })
    .uuid({ error: "有効なレストランIDを指定してください" }),
});

// ミドルウェアで設定されたユーザーIDを取得
function getUserId(request: NextRequest): string {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    throw new Error("認証が必要です");
  }
  return userId;
}

// お気に入りのレストラン一覧を取得
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const restaurants = await favoriteService.getFavoriteRestaurants(userId);

    return NextResponse.json({ restaurants });
  } catch (error) {
    if (error instanceof Error && error.message === "認証が必要です") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Error fetching favorite restaurants:", error);
    return NextResponse.json(
      { error: "お気に入りの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// お気に入りに追加
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const body = await request.json();

    const result = restaurantIdSchema.safeParse(body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return NextResponse.json(
        { error: firstIssue.message },
        { status: 400 }
      );
    }

    await favoriteService.addFavorite(userId, result.data.restaurantId);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "認証が必要です") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "お気に入りの追加に失敗しました" },
      { status: 500 }
    );
  }
}

// お気に入りから削除
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    const result = restaurantIdSchema.safeParse({ restaurantId });
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return NextResponse.json(
        { error: firstIssue.message },
        { status: 400 }
      );
    }

    await favoriteService.removeFavorite(userId, result.data.restaurantId);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "認証が必要です") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "お気に入りの削除に失敗しました" },
      { status: 500 }
    );
  }
}
