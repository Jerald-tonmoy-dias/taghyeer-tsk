"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/features/auth/auth-provider";

/**
 * Left pane: session chrome and a slot for the inbox (next ticket).
 * @returns JSX.Element
 */
export function ChatSidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Taghyeer</p>
          <p className="truncate text-xs text-muted-foreground">{user?.name}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={logout}
          aria-label="Log out"
        >
          <LogOut />
        </Button>
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 px-4 py-6">
          <p className="text-sm text-muted-foreground">
            Conversations will show up here.
          </p>
          <Button variant="outline" size="sm" className="w-fit" asChild>
            <Link href="/app?c=preview">Preview thread layout</Link>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
