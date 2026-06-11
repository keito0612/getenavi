import { NextRequest, NextResponse } from "next/server";
import { restaurantService } from "@/services/restaurantService";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 検索クエリ
    const query = searchParams.get("q") || undefined;

    // タグフィルター
    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",") : undefined;

    // 地図範囲フィルター
    const north = searchParams.get("north");
    const south = searchParams.get("south");
    const east = searchParams.get("east");
    const west = searchParams.get("west");

    const bounds =
      north && south && east && west
        ? {
            north: parseFloat(north),
            south: parseFloat(south),
            east: parseFloat(east),
            west: parseFloat(west),
          }
        : undefined;

    const restaurants = await restaurantService.getRestaurants({ query, tags, bounds });

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
