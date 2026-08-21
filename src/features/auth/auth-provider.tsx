"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, login as loginRequest } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/error";
import { clearToken, getToken, setToken } from "@/lib/api/token";
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
 * Load and persist the signed-in user. Restores via `/auth/me` when a token exists.
 * @param props.children - Tree that can call `useAuth`
 * @returns ReactNode
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [hasCheckedToken, setHasCheckedToken] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getToken()));
    setHasCheckedToken(true);
  }, []);

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: getMe,
    enabled: hasCheckedToken && hasToken,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!sessionQuery.isError || !isApiError(sessionQuery.error)) {
      return;
    }
    if (sessionQuery.error.isAuthError) {
      clearToken();
      setHasToken(false);
    }
  }, [sessionQuery.error, sessionQuery.isError]);

  const status: AuthStatus = !hasCheckedToken
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
      setHasToken(true);
      queryClient.setQueryData(["session"], session.user);
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    clearToken();
    setHasToken(false);
    queryClient.removeQueries({ queryKey: ["session"] });
  }, [queryClient]);

  const retryRestore = useCallback(() => {
    void sessionQuery.refetch();
  }, [sessionQuery]);

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
