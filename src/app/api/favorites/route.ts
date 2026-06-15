import { NextRequest } from "next/server";
import { favoriteService } from "@/services/favoriteService";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  return favoriteService.getFavorites(request);
}

export async function POST(request: NextRequest) {
  return favoriteService.addFavorite(request);
}

export async function DELETE(request: NextRequest) {
  return favoriteService.removeFavorite(request);
}
