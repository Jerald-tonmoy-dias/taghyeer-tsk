"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-provider";
import { ChatAvatar, ChatMark } from "@/features/chat/chat-ui";
import { LogoutDialog } from "@/features/chat/logout-dialog";
import { useSocketStatus } from "@/features/chat/realtime-provider";
import { ConversationList } from "@/features/inbox/conversation-list";
import { SearchPeople } from "@/features/inbox/search-people";
import { NewGroup } from "@/features/groups/new-group";
import { listConversations } from "@/lib/api/conversations";
import { cn } from "@/lib/utils";

type ChatSidebarProps = {
  selectedId: string | null;
};

type InboxTab = "direct" | "group";

/**
 * Left pane: brand, search, new group, inbox tabs, and session.
 * @param props.selectedId - Open conversation from `?c=`
 * @returns JSX.Element
 */
export function ChatSidebar({ selectedId }: ChatSidebarProps) {
  const { user } = useAuth();
  const { connected } = useSocketStatus();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [tab, setTab] = useState<InboxTab>("direct");
  const inboxQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
  });

  const directCount =
    inboxQuery.data?.filter((item) => item.type === "direct").length ?? 0;
  const groupCount =
    inboxQuery.data?.filter((item) => item.type === "group").length ?? 0;

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-landing-surface">
      <header className="flex items-center justify-between border-b border-landing-border bg-slate-50/70 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <ChatMark />
          <span className="font-landing-display text-lg font-bold tracking-tight text-landing-ink">
            Taghyeer
          </span>
        </div>
      </header>

      <div className="space-y-2 border-b border-landing-border p-3">
        <NewGroup onCreated={() => setTab("group")} />
        <SearchPeople onStarted={() => setTab("direct")} />
      </div>

      <div className="flex items-center gap-6 border-b border-landing-border/60 px-4 pt-2.5 pb-1 text-[11px] font-semibold tracking-wider text-landing-muted uppercase">
        <button
          type="button"
          onClick={() => setTab("direct")}
          className={cn(
            "pb-1 transition-all",
            tab === "direct"
              ? "border-b-2 border-landing-primary font-bold text-landing-primary"
              : "hover:text-landing-ink",
          )}
        >
          Direct ({directCount})
        </button>
        <button
          type="button"
          onClick={() => setTab("group")}
          className={cn(
            "pb-1 transition-all",
            tab === "group"
              ? "border-b-2 border-landing-primary font-bold text-landing-primary"
              : "hover:text-landing-ink",
          )}
        >
          Groups ({groupCount})
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
        <ConversationList selectedId={selectedId} tab={tab} />
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-landing-border bg-slate-50/90 p-3.5">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <ChatAvatar
            name={user?.name ?? "You"}
            size="sm"
            connected={connected}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 truncate text-xs font-bold text-landing-ink">
              <span className="truncate">{user?.name}</span>
              <span
                className={cn(
                  "rounded border px-1 font-landing-mono text-[9px] font-medium",
                  connected
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-100 text-slate-600",
                )}
              >
                {connected ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <div className="truncate font-landing-mono text-[10px] text-landing-muted">
              {user?.phone}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-landing-border bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-xs transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  );
}
