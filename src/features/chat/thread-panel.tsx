"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChatAvatar } from "@/features/chat/chat-ui";
import { useSocketStatus } from "@/features/chat/realtime-provider";
import { Composer } from "@/features/thread/composer";
import { MessageList } from "@/features/thread/message-list";
import { listConversations } from "@/lib/api/conversations";
import { conversationTitle } from "@/lib/conversation-title";
import { useAuth } from "@/features/auth/auth-provider";
import { cn } from "@/lib/utils";

type ThreadPanelProps = {
  conversationId: string | null;
  detailsOpen: boolean;
  onToggleDetails: () => void;
};

/**
 * Thread chrome, history, and composer when `?c=` is set.
 * @param props.conversationId - Selected conversation from the URL, or null
 * @param props.detailsOpen - Whether Room Details is visible
 * @param props.onToggleDetails - Open or close the details drawer
 * @returns JSX.Element
 */
export function ThreadPanel({
  conversationId,
  detailsOpen,
  onToggleDetails,
}: ThreadPanelProps) {
  const [scrollToken, setScrollToken] = useState(0);
  const { user } = useAuth();
  const { connected } = useSocketStatus();
  const inboxQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
    enabled: Boolean(conversationId),
  });

  if (!conversationId) {
    return (
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="font-landing-display text-lg font-medium text-landing-ink">
          Select a conversation
        </p>
        <p className="max-w-sm text-sm text-landing-muted">
          Pick someone from the list, or search to start a new chat.
        </p>
      </div>
    );
  }

  const conversation = inboxQuery.data?.find(
    (item) => item.id === conversationId,
  );
  const title = conversation ? conversationTitle(conversation) : "Conversation";
  const isGroup = conversation?.type === "group";
  const isAdmin =
    isGroup && user ? conversation.admins.includes(user.id) : false;
  const subtitle = isGroup
    ? `${conversation.participants.length} Participants`
    : conversation?.type === "direct"
      ? `${conversation.participant.phone} • Direct 1:1 Thread`
      : "";

  const badge = isGroup
    ? isAdmin
      ? {
          label: "YOU: ADMIN",
          className: "border-amber-200 bg-amber-50 text-amber-700",
        }
      : {
          label: `${conversation.participants.length} MEMBERS`,
          className: "border-blue-200 bg-blue-50 text-blue-700",
        }
    : connected
      ? {
          label: "active connection",
          className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        }
      : {
          label: "reconnecting",
          className: "border-slate-200 bg-slate-100 text-slate-600",
        };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-slate-50/50">
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-landing-border bg-landing-surface px-3 shadow-xs md:px-6">
        <div className="flex min-w-0 items-center gap-3.5">
          <Link
            href="/app"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-landing-muted hover:bg-slate-100 md:hidden"
            aria-label="Back to conversations"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <ChatAvatar name={title} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-landing-display text-base font-semibold leading-none text-landing-ink">
                {title}
              </h2>
              <span
                className={cn(
                  "hidden items-center gap-1 rounded-full border px-2 py-0.5 font-landing-mono text-[10px] font-medium sm:flex",
                  badge.className,
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {badge.label}
              </span>
            </div>
            {subtitle ? (
              <p className="mt-1 truncate font-landing-mono text-xs text-landing-muted">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleDetails}
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-100 hover:text-landing-ink sm:px-3",
            detailsOpen
              ? "border-landing-primary/30 bg-landing-primary-soft text-landing-primary"
              : "border-landing-border",
          )}
        >
          <svg
            className="h-4 w-4 text-landing-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <span className="hidden sm:inline">Room Details</span>
        </button>
      </header>
      <MessageList
        key={`messages-${conversationId}`}
        conversationId={conversationId}
        conversation={conversation}
        scrollToken={scrollToken}
      />
      <Composer
        key={`composer-${conversationId}`}
        conversationId={conversationId}
        placeholder={
          isGroup ? `Message #${title}...` : `Message ${title}...`
        }
        onSent={() => setScrollToken((token) => token + 1)}
      />
    </div>
  );
}
