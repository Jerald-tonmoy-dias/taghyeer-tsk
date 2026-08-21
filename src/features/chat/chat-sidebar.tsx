"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/features/auth/auth-provider";
import { ConversationList } from "@/features/inbox/conversation-list";
import { SearchPeople } from "@/features/inbox/search-people";

type ChatSidebarProps = {
  selectedId: string | null;
};

/**
 * Left pane: session, people search, and inbox.
 * @param props.selectedId - Open conversation from `?c=`
 * @returns JSX.Element
 */
export function ChatSidebar({ selectedId }: ChatSidebarProps) {
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
      <SearchPeople />
      <ScrollArea className="min-h-0 flex-1">
        <ConversationList selectedId={selectedId} />
      </ScrollArea>
    </div>
  );
}
