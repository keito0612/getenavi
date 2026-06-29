"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { frontendFavoriteService } from "@/services/frontend/favoriteService";
import { UtilApi } from "@/lib/utilApi";

export function useFavorites() {
  const { isAuthenticated, isPending: authPending } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 認証済みの場合、APIからお気に入り一覧を取得
  useEffect(() => {
    if (authPending) return;

    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        setIsLoaded(true);
        return;
      }

      try {
        const restaurants = await frontendFavoriteService.getFavoriteRestaurants();
        setFavorites(restaurants.map((r) => r.id));
      } catch {
        setFavorites([]);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, authPending]);

  // お気に入りに追加
  const addFavorite = useCallback(async (id: string) => {
    // 楽観的更新
    setFavorites((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });

    try {
      await frontendFavoriteService.addFavorite(id);
      toast.success("お気に入りに登録しました。");
    } catch (error) {
      // エラー時はロールバック
      setFavorites((prev) => prev.filter((fav) => fav !== id));
      UtilApi.handleError(error, {
        401: () => toast.error("ログインが必要です"),
      });
    }
  }, []);

  // お気に入りから削除
  const removeFavorite = useCallback(
    async (id: string) => {
      // 楽観的更新
      const previousFavorites = [...favorites];
      setFavorites((prev) => prev.filter((fav) => fav !== id));

      try {
        await frontendFavoriteService.removeFavorite(id);
        toast.success("お気に入りを解除しました。");
      } catch (error) {
        // エラー時はロールバック
        setFavorites(previousFavorites);
        UtilApi.handleError(error, {
          401: () => toast.error("ログインが必要です"),
          404: () => toast.error("削除するお気に入りがありません。"),
        });
      }
    },
    [favorites]
  );

  // お気に入りをトグル
  const toggleFavorite = useCallback(
    async (id: string) => {
      const isCurrentlyFavorite = favorites.includes(id);

      if (isCurrentlyFavorite) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  // お気に入りかどうか判定
  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
