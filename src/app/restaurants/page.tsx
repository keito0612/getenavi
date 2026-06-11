import { Suspense } from "react";
import { restaurantService } from "@/services/restaurantService";
import { tagService } from "@/services/tagService";
import { RestaurantList } from "./RestaurantList";
import Loading from "./loading";

export const metadata = {
  title: "店舗一覧 - ゲテナビ",
  description: "珍食・ゲテモノ飲食店の一覧",
};

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RestaurantsContent />
    </Suspense>
  );
}

async function RestaurantsContent() {
  const [restaurants, tags] = await Promise.all([
    restaurantService.getRestaurants(),
    tagService.getTags(),
  ]);

  return <RestaurantList initialRestaurants={restaurants} tags={tags} />;
}
