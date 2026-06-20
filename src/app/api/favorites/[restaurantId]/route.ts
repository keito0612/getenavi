import { NextRequest } from "next/server";
import { favoriteService } from "@/services/favoriteService";

type Params = {
  params: Promise<{ restaurantId: string }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  const { restaurantId } = await params;
  return favoriteService.addFavorite(request, restaurantId);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { restaurantId } = await params;
  return favoriteService.removeFavorite(request, restaurantId);
}
