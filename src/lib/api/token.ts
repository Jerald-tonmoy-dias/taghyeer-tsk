const TOKEN_KEY = "taghyeer.token";

/**
 * Read the JWT from `localStorage`.
 * @returns string | null
 */
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
}

/**
 * Persist the JWT for later Bearer requests.
 * @param token - JWT from login
 * @returns void
 */
export function setToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the stored JWT (logout / invalid session).
 * @returns void
 */
export function clearToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
}
