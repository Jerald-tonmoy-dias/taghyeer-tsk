const TOKEN_KEY = "taghyeer.token";

const listeners = new Set<() => void>();

/**
 * Notify subscribers after the stored JWT changes.
 * @returns void
 */
function notifyTokenListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Subscribe to JWT changes in this tab.
 * @param listener - Called after set/clear
 * @returns () => void — unsubscribe
 */
export function subscribeToken(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

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
  notifyTokenListeners();
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
  notifyTokenListeners();
}
