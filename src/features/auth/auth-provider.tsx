"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, login as loginRequest } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/error";
import {
  clearToken,
  getToken,
  setToken,
  subscribeToken,
} from "@/lib/api/token";
import type { User } from "@/lib/types";

export type AuthStatus = "loading" | "authenticated" | "anonymous" | "error";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  login: (input: { phone: string; name: string }) => Promise<void>;
  logout: () => void;
  retryRestore: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * True after hydration so we do not read `localStorage` during SSR.
 * @returns boolean
 */
function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Load the current user. Clears the JWT when the API says it is invalid.
 * @returns Promise<User>
 */
async function restoreSession(): Promise<User> {
  try {
    return await getMe();
  } catch (error) {
    if (isApiError(error) && error.isAuthError) {
      clearToken();
    }
    throw error;
  }
}

/**
 * Load and persist the signed-in user. Restores via `/auth/me` when a token exists.
 * @param props.children - Tree that can call `useAuth`
 * @returns ReactNode
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const isClient = useIsClient();
  const token = useSyncExternalStore(subscribeToken, getToken, () => null);
  const hasToken = isClient && Boolean(token);

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: restoreSession,
    enabled: hasToken,
    retry: false,
    staleTime: Infinity,
  });

  const status: AuthStatus = !isClient
    ? "loading"
    : !hasToken
      ? "anonymous"
      : sessionQuery.isPending
        ? "loading"
        : sessionQuery.isSuccess
          ? "authenticated"
          : sessionQuery.isError &&
              isApiError(sessionQuery.error) &&
              sessionQuery.error.isAuthError
            ? "anonymous"
            : "error";

  const login = useCallback(
    async (input: { phone: string; name: string }) => {
      const session = await loginRequest(input);
      setToken(session.token);
      queryClient.setQueryData(["session"], session.user);
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    clearToken();
    queryClient.removeQueries({ queryKey: ["session"] });
  }, [queryClient]);

  const retryRestore = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["session"] });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: sessionQuery.data ?? null,
      status,
      login,
      logout,
      retryRestore,
    }),
    [login, logout, retryRestore, sessionQuery.data, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Access the current session. Must be used under `AuthProvider`.
 * @returns AuthContextValue
 */
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
