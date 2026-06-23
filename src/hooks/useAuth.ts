"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "better-auth";

const TOKEN_KEY = "auth_token";

// トークン管理
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// 認証ユーザー型定義
type AuthUser = User | null;

type UseAuthReturn = {
  user: AuthUser;
  isAuthenticated: boolean;
  isPending: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

// Auth clientを取得（Bearer token付き）
async function getAuthClient() {
  const { createAuthClient } = await import("better-auth/client");
  return createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    fetchOptions: {
      auth: {
        type: "Bearer",
        token: () => getToken() || "",
      },
    },
  });
}

// Bearer Token認証フック
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsPending(true);
      const token = getToken();
      if (!token) {
        setUser(null);
        setError(null);
        return;
      }
      const client = await getAuthClient();
      const response = await client.getSession();
      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
        clearToken();
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("認証情報の取得に失敗しました"));
      setUser(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isAuthenticated: !!user,
    isPending,
    error,
    refetch: fetchUser
  };
}

// signIn
export const signIn = {
  email: async (
    data: { email: string; password: string },
    options?: { onSuccess?: () => void; onError?: (ctx: { error: Error }) => void }
  ) => {
    try {
      const client = await getAuthClient();
      const result = await client.signIn.email(data, {
        onSuccess: (ctx) => {
          // Bearer tokenをレスポンスヘッダーから取得して保存
          const token = ctx.response.headers.get("set-auth-token");
          if (token) {
            setToken(token);
          }
          options?.onSuccess?.();
        },
        onError: (ctx) => {
          options?.onError?.({ error: ctx.error });
        },
      });
      return result;
    } catch (err) {
      options?.onError?.({ error: err instanceof Error ? err : new Error("Sign in failed") });
      throw err;
    }
  },
};

// signUp
export const signUp = {
  email: async (
    data: { email: string; password: string; name: string },
    options?: { onSuccess?: () => void; onError?: (ctx: { error: Error }) => void }
  ) => {
    try {
      const client = await getAuthClient();
      const result = await client.signUp.email(data, {
        onSuccess: (ctx) => {
          // Bearer tokenをレスポンスヘッダーから取得して保存
          const token = ctx.response.headers.get("set-auth-token");
          if (token) {
            setToken(token);
          }
          options?.onSuccess?.();
        },
        onError: (ctx) => {
          options?.onError?.({ error: ctx.error });
        },
      });
      return result;
    } catch (err) {
      options?.onError?.({ error: err instanceof Error ? err : new Error("Sign up failed") });
      throw err;
    }
  },
};

// signOut
export async function signOut() {
  const client = await getAuthClient();
  const result = await client.signOut();
  clearToken();
  return result;
}
