import { NextRequest } from "next/server";
import { restaurantService } from "@/services/restaurantService";

export const runtime = "edge";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  return restaurantService.getRestaurant(id);
}
