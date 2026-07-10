import {
  frontendRestaurantRepository,
  type IFrontendRestaurantRepository,
} from "@/repositories/frontend";
import type { RestaurantData } from "@/lib/types";

export type FrontendRestaurantQueryParams = {
  query?: string;
  tags?: number[];
};

export class FrontendRestaurantService {
  constructor(private readonly repository: IFrontendRestaurantRepository) {}

  async getRestaurants(params?: FrontendRestaurantQueryParams): Promise<RestaurantData[]> {
    return this.repository.getRestaurants(params);
  }

  async getRestaurant(id: string): Promise<RestaurantData | null> {
    return this.repository.getRestaurant(id);
  }
}

export const frontendRestaurantService = new FrontendRestaurantService(
  frontendRestaurantRepository
);
