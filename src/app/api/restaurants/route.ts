import { NextRequest } from "next/server";
import { restaurantService } from "@/services/restaurantService";

export async function GET(request: NextRequest) {
  return restaurantService.getRestaurants(request);
}
