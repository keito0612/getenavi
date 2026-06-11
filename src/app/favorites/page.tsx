import { Metadata } from "next";
import { FavoritesClient } from "./FavoritesClient";

export const metadata: Metadata = {
  title: "お気に入り - ゲテナビ",
  description: "お気に入りに登録した珍食・ゲテモノ飲食店",
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
