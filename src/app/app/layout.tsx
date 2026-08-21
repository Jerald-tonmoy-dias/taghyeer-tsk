"use client";

import type { ReactNode } from "react";
import { RequireAuth } from "@/features/auth/require-auth";
import { RealtimeProvider } from "@/features/chat/realtime-provider";

/**
 * Gate all `/app` routes behind a signed-in session and the live socket.
 * @param props.children - App pages
 * @returns JSX.Element
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <RealtimeProvider>{children}</RealtimeProvider>
    </RequireAuth>
  );
}
