"use client";

import type { ReactNode } from "react";
import { RequireAuth } from "@/features/auth/require-auth";

/**
 * Gate all `/app` routes behind a signed-in session.
 * @param props.children - App pages
 * @returns JSX.Element
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
