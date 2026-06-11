"use client";

import { FavoritesLink } from "./FavoritesLink";
import { ListLink } from "./ListLink";
import { SubmitLink } from "./SubmitLink";

export function HomeHeader() {
  return (
    <header className="bg-orange-500 text-white px-4 py-3 shadow-md z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">ゲテナビ</h1>
        <div className="flex items-center gap-2">
          <FavoritesLink />
          <ListLink />
          <SubmitLink />
        </div>
      </div>
    </header>
  );
}
