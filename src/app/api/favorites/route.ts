import { NextRequest } from "next/server";
import { favoriteService } from "@/services/favoriteService";

export async function GET(request: NextRequest) {
  return favoriteService.getFavorites(request);
}
