"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/auth-provider";

/**
 * Block `/app` until a session exists. Guests go to `/login`.
 * @param props.children - Chat UI
 * @returns ReactNode
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, retryRestore } = useAuth();

  useEffect(() => {
    if (status === "anonymous") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-3 px-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
        <p className="text-destructive">Could not restore your session.</p>
        <Button type="button" onClick={retryRestore}>
          Try again
        </Button>
      </div>
    );
  }

  if (status === "anonymous") {
    return null;
  }

  return children;
}
