import { MyPageClient } from "./components/MyPageClient";

export const metadata = {
  title: "マイページ - ゲテナビ",
  description: "ユーザー情報の確認・編集",
};

export default function MyPage() {
  return <MyPageClient />;
}
