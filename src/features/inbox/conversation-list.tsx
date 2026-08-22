"use client";

import { useQuery } from "@tanstack/react-query";
import { ConversationRow } from "@/features/inbox/conversation-row";
import { listConversations } from "@/lib/api/conversations";

type ConversationListProps = {
  selectedId: string | null;
  tab: "direct" | "group";
};

/**
 * Live inbox filtered to 1:1 or groups.
 * @param props.selectedId - Open conversation from `?c=`
 * @param props.tab - Direct or group filter
 * @returns JSX.Element
 */
export function ConversationList({ selectedId, tab }: ConversationListProps) {
  const inboxQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
  });

  if (inboxQuery.isPending) {
    return (
      <div className="flex flex-col gap-2 px-2 py-3">
        <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (inboxQuery.isError) {
    return (
      <div className="flex flex-col gap-2 px-3 py-6">
        <p className="text-xs text-rose-600">Could not load conversations.</p>
        <button
          type="button"
          className="w-fit text-xs font-semibold text-landing-primary hover:underline"
          onClick={() => void inboxQuery.refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  const rows = inboxQuery.data.filter((conversation) =>
    tab === "group"
      ? conversation.type === "group"
      : conversation.type === "direct",
  );

  if (rows.length === 0) {
    return (
      <p className="px-3 py-6 text-xs text-landing-muted">
        {tab === "group"
          ? "No groups yet. Create one with at least two other people."
          : "No direct chats yet. Search for someone to start one."}
      </p>
    );
  }

  return (
    <div className="space-y-0.5">
      {rows.map((conversation) => (
        <ConversationRow
          key={conversation.id}
          conversation={conversation}
          selected={conversation.id === selectedId}
        />
      ))}
    </div>
  );
}
