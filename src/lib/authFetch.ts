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

  // FormDataの場合はContent-Typeを設定しない（ブラウザが自動設定）
  const isFormData = fetchOptions.body instanceof FormData;
  if (!headers.has("Content-Type") && fetchOptions.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...fetchOptions,
    headers,
  });
}
