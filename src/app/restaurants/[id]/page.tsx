import { Suspense } from "react";
import { notFound } from "next/navigation";
import { frontendRestaurantService } from "@/services/frontend";
import { RestaurantDetail } from "./RestaurantDetail";
import Loading from "./loading";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const restaurant = await frontendRestaurantService.getRestaurant(id);

  if (!restaurant) {
    return { title: "店舗が見つかりません - ゲテナビ" };
  }

  return {
    title: `${restaurant.name} - ゲテナビ`,
    description: restaurant.description || `${restaurant.name}の店舗情報`,
  };
}

export default function RestaurantPage({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <RestaurantContent params={params} />
    </Suspense>
  );
}

async function RestaurantContent({ params }: Props) {
  const { id } = await params;
  const restaurant = await frontendRestaurantService.getRestaurant(id);

  if (!restaurant) {
    notFound();
  }

  return <RestaurantDetail restaurant={restaurant} />;
}
