import { getToken } from "@/lib/api/token";
import { parseApiError } from "@/lib/api/error";

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | number | undefined>;
};

/**
 * Resolve the REST base URL from env (no trailing slash).
 * @returns string
 */
function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return baseUrl.replace(/\/$/, "");
}

/**
 * Append defined query params to a path.
 * @param path - API path, e.g. `/users/search`
 * @param query - Optional key/value query map
 * @returns string
 */
function withQuery(
  path: string,
  query?: Record<string, string | number | undefined>,
): string {
  if (!query) {
    return path;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") {
      continue;
    }
    params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

/**
 * JSON fetch against the chat API. Attaches Bearer when a token exists.
 * @param path - Path under `NEXT_PUBLIC_API_URL`
 * @param options - Method, body, auth flag, and query
 * @returns Promise<T>
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true, query } = options;
  const headers = new Headers({ Accept: "application/json" });

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${getBaseUrl()}${withQuery(path, query)}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw parseApiError(response.status, payload);
  }

  return payload as T;
}
