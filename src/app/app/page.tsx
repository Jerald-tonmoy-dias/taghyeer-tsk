"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";

/**
 * Signed-in chat shell placeholder until the inbox ticket.
 * @returns JSX.Element
 */
export default function ChatPage() {
  const { user, logout } = useAuth();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
      <p className="text-muted-foreground">
        Signed in as {user?.name}. Inbox and thread UI come next.
      </p>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={logout}>
          Log out
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </main>
  );
}
