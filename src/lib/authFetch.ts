import { getToken } from "@/hooks/useAuth";

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

/**
 * Bearer Token認証付きfetch
 */
export async function authFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...fetchOptions,
    headers,
  });
}
