"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/auth-provider";

/**
 * Send signed-in users away from `/login` to `/app`.
 * @param props.children - Login page
 * @returns ReactNode
 */
export function RedirectIfSignedIn({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/app");
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

  if (status === "authenticated") {
    return null;
  }

  return children;
}
