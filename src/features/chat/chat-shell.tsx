"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatSidebar } from "@/features/chat/chat-sidebar";
import { RoomDetails } from "@/features/chat/room-details";
import { ThreadPanel } from "@/features/chat/thread-panel";
import { cn } from "@/lib/utils";

/**
 * Three-pane chat layout. Desktop can show inbox, thread, and details.
 * Mobile shows the list or the thread from `?c=`.
 * @returns JSX.Element
 */
export function ChatShell() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("c");
  const isThreadOpen = Boolean(conversationId);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const detailsOpen = Boolean(conversationId && detailsId === conversationId);

  return (
    <div className="flex h-dvh min-h-0 bg-landing-sand-light/50">
      <aside
        className={cn(
          "h-full w-full shrink-0 border-r border-landing-border md:w-80",
          isThreadOpen ? "hidden md:flex" : "flex",
        )}
      >
        <ChatSidebar selectedId={conversationId} />
      </aside>
      <section
        className={cn(
          "flex h-full min-w-0 flex-1",
          isThreadOpen ? "flex" : "hidden md:flex",
        )}
      >
        <ThreadPanel
          conversationId={conversationId}
          detailsOpen={detailsOpen}
          onToggleDetails={() =>
            setDetailsId((current) =>
              conversationId && current === conversationId
                ? null
                : conversationId,
            )
          }
        />
      </section>
      {detailsOpen && conversationId ? (
        <RoomDetails
          conversationId={conversationId}
          onClose={() => setDetailsId(null)}
        />
      ) : null}
    </div>
  );
}
