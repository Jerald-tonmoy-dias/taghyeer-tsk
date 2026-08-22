"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-provider";
import { chatFieldClass } from "@/features/chat/chat-ui";
import { useSocketStatus } from "@/features/chat/realtime-provider";
import { upsertGroupInInbox } from "@/features/chat/upsert-group";
import { useDebouncedValue } from "@/features/inbox/use-debounced-value";
import {
  addParticipants,
  listConversations,
  removeParticipant,
  renameGroup,
} from "@/lib/api/conversations";
import { isApiError } from "@/lib/api/error";
import { searchUsers } from "@/lib/api/users";
import type { Conversation, GroupConversation, User } from "@/lib/types";
import { cn } from "@/lib/utils";

type RoomDetailsProps = {
  conversationId: string;
  onClose: () => void;
};

/**
 * Right-hand drawer: 1:1 profile, or group admin actions.
 * @param props.conversationId - Open conversation
 * @param props.onClose - Hide the drawer
 * @returns JSX.Element
 */
export function RoomDetails({ conversationId, onClose }: RoomDetailsProps) {
  const inboxQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
  });
  const conversation = inboxQuery.data?.find(
    (item) => item.id === conversationId,
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-landing-ink/40 md:static md:z-0 md:bg-transparent">
      <button
        type="button"
        className="h-full flex-1 md:hidden"
        aria-label="Close room details"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-sm shrink-0 flex-col border-l border-landing-border bg-landing-surface md:w-80 md:max-w-none">
        <div className="flex items-center justify-between border-b border-landing-border bg-slate-50/50 p-4">
          <h3 className="font-landing-display text-sm font-semibold text-landing-ink">
            Conversation Details
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="font-landing-sans text-xs text-slate-400 hover:text-slate-600"
          >
            ✕ Close
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-4 text-xs font-landing-sans">
          {!conversation ? (
            <p className="text-landing-muted">Loading details…</p>
          ) : conversation.type === "group" ? (
            <GroupDetails
              key={conversation.id}
              conversation={conversation}
              onClose={onClose}
            />
          ) : (
            <DirectDetails conversation={conversation} />
          )}
        </div>
      </aside>
    </div>
  );
}

type DirectDetailsProps = {
  conversation: Extract<Conversation, { type: "direct" }>;
};

/**
 * 1:1 details: name, phone, and this tab’s socket state.
 * @param props.conversation - Direct chat
 * @returns JSX.Element
 */
function DirectDetails({ conversation }: DirectDetailsProps) {
  const { connected } = useSocketStatus();

  return (
    <div>
      <p className="mb-1.5 text-[10px] font-bold tracking-wider text-landing-muted uppercase">
        Participant Details
      </p>
      <div className="space-y-1 rounded-xl border border-landing-border bg-slate-50 p-3">
        <div className="font-chat text-sm font-bold text-landing-ink">
          {conversation.participant.name}
        </div>
        <div className="font-landing-mono text-xs text-landing-muted">
          {conversation.participant.phone}
        </div>
        <div
          className={cn(
            "pt-1 text-[11px] font-medium",
            connected ? "text-emerald-600" : "text-slate-500",
          )}
        >
          ● {connected ? "Real-time Connection Active" : "Reconnecting…"}
        </div>
      </div>
    </div>
  );
}

type GroupDetailsProps = {
  conversation: GroupConversation;
  onClose: () => void;
};

/**
 * Group rename, members, add, remove, and leave.
 * @param props.conversation - Open group
 * @param props.onClose - Close the drawer after leaving
 * @returns JSX.Element
 */
function GroupDetails({ conversation, onClose }: GroupDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [draftName, setDraftName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = Boolean(user && conversation.admins.includes(user.id));
  const name = draftName ?? conversation.name;

  /**
   * Write the returned group into the inbox cache.
   * @param group - API response
   * @returns void
   */
  function putGroup(group: GroupConversation) {
    queryClient.setQueryData<Conversation[]>(["conversations"], (inbox) =>
      upsertGroupInInbox(inbox, group),
    );
  }

  const rename = useMutation({
    mutationFn: () => renameGroup(conversation.id, name.trim()),
    onSuccess: (group) => {
      setError(null);
      setDraftName(null);
      putGroup(group);
    },
    onError: (caught) => {
      setError(isApiError(caught) ? caught.message : "Could not rename.");
    },
  });

  const remove = useMutation({
    mutationFn: (userId: string) => removeParticipant(conversation.id, userId),
    onSuccess: (group, userId) => {
      setError(null);
      if (user && userId === user.id) {
        queryClient.setQueryData<Conversation[]>(["conversations"], (inbox) =>
          inbox?.filter((item) => item.id !== conversation.id),
        );
        onClose();
        router.replace("/app");
        return;
      }
      putGroup(group);
    },
    onError: (caught) => {
      setError(
        isApiError(caught) ? caught.message : "Could not update members.",
      );
    },
  });

  const canSaveName = isAdmin && name.trim() && name.trim() !== conversation.name;

  return (
    <>
      <div>
        <label
          htmlFor="group-title"
          className="mb-1.5 block text-[10px] font-bold tracking-wider text-landing-muted uppercase"
        >
          Group Title {isAdmin ? "(Admin Only)" : ""}
        </label>
        {isAdmin ? (
          <div className="flex gap-1.5">
            <input
              id="group-title"
              value={name}
              onChange={(event) => {
                setDraftName(event.target.value);
                setError(null);
              }}
              disabled={rename.isPending}
              className={cn(chatFieldClass, "flex-1 py-1.5")}
            />
            <button
              type="button"
              disabled={!canSaveName || rename.isPending}
              onClick={() => rename.mutate()}
              className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-black disabled:opacity-50"
            >
              {rename.isPending ? "…" : "Save"}
            </button>
          </div>
        ) : (
          <p className="rounded-lg border border-landing-border bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-landing-ink">
            {conversation.name}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-landing-muted uppercase">
            Members ({conversation.participants.length})
          </span>
        </div>
        {isAdmin ? <AddMember conversation={conversation} onError={setError} /> : null}
        <div className="mt-2 space-y-2">
          {conversation.participants.map((person) => {
            const admin = conversation.admins.includes(person.id);
            const isMe = person.id === user?.id;
            return (
              <div
                key={person.id}
                className="flex items-center justify-between rounded-lg border border-landing-border bg-slate-50 p-2 font-chat"
              >
                <div>
                  <div className="font-medium text-landing-ink">
                    {person.name}
                    {isMe ? " (You)" : ""}
                  </div>
                  <div className="font-landing-mono text-[10px] text-landing-muted">
                    {person.phone}
                  </div>
                </div>
                {admin ? (
                  <span className="rounded border border-amber-200 bg-amber-50 px-1 font-landing-mono text-[9px] text-amber-700">
                    ADMIN
                  </span>
                ) : isAdmin ? (
                  <button
                    type="button"
                    disabled={remove.isPending}
                    onClick={() => remove.mutate(person.id)}
                    className="text-[10px] text-rose-600 hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {error ? <p className="text-rose-600">{error}</p> : null}

      <div className="border-t border-landing-border pt-4">
        <button
          type="button"
          disabled={!user || remove.isPending}
          onClick={() => user && remove.mutate(user.id)}
          className="w-full rounded-xl border border-rose-200 py-2 font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
        >
          Leave Group Conversation
        </button>
      </div>
    </>
  );
}

type AddMemberProps = {
  conversation: GroupConversation;
  onError: (message: string | null) => void;
};

/**
 * Admin search to add an existing user to the group.
 * @param props.conversation - Open group
 * @param props.onError - Surface API errors in the drawer
 * @returns JSX.Element
 */
function AddMember({ conversation, onError }: AddMemberProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  const searchQuery = useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: open && debouncedQuery.length >= 1,
  });

  const add = useMutation({
    mutationFn: (userId: string) => addParticipants(conversation.id, [userId]),
    onSuccess: (group) => {
      onError(null);
      setQuery("");
      setOpen(false);
      queryClient.setQueryData<Conversation[]>(["conversations"], (inbox) =>
        upsertGroupInInbox(inbox, group),
      );
    },
    onError: (caught) => {
      onError(isApiError(caught) ? caught.message : "Could not add that person.");
    },
  });

  const memberIds = new Set(conversation.participants.map((person) => person.id));
  const results =
    searchQuery.data?.filter((person) => !memberIds.has(person.id)) ?? [];

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-[10px] font-bold text-landing-primary hover:underline"
      >
        + Add Member
      </button>
      {open ? (
        <div className="mt-2 space-y-2">
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              onError(null);
            }}
            placeholder="Search people by name or phone..."
            className={cn(chatFieldClass, "py-1.5")}
          />
          {query.trim() ? (
            <AddMemberResults
              isPending={searchQuery.isPending}
              isError={searchQuery.isError}
              results={results}
              adding={add.isPending}
              onSelect={(person) => add.mutate(person.id)}
              onRetry={() => void searchQuery.refetch()}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

type AddMemberResultsProps = {
  isPending: boolean;
  isError: boolean;
  results: User[];
  adding: boolean;
  onSelect: (person: User) => void;
  onRetry: () => void;
};

/**
 * People who are not already in the group.
 * @param props - Query status and handlers
 * @returns JSX.Element
 */
function AddMemberResults({
  isPending,
  isError,
  results,
  adding,
  onSelect,
  onRetry,
}: AddMemberResultsProps) {
  if (isPending) {
    return <p className="text-[11px] text-landing-muted">Searching…</p>;
  }
  if (isError) {
    return (
      <button
        type="button"
        className="text-[11px] text-rose-600 underline"
        onClick={onRetry}
      >
        Search failed. Try again
      </button>
    );
  }
  if (results.length === 0) {
    return <p className="text-[11px] text-landing-muted">No people found.</p>;
  }
  return (
    <ul className="max-h-36 overflow-y-auto rounded-xl border border-landing-border">
      {results.map((person) => (
        <li key={person.id}>
          <button
            type="button"
            disabled={adding}
            onClick={() => onSelect(person)}
            className="flex w-full flex-col items-start px-2.5 py-2 text-left hover:bg-slate-50 disabled:opacity-60"
          >
            <span className="font-medium text-landing-ink">{person.name}</span>
            <span className="font-landing-mono text-[10px] text-landing-muted">
              {person.phone}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
