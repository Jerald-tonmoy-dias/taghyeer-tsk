"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/auth-provider";
import { chatFieldClass } from "@/features/chat/chat-ui";
import { validateCreateGroup } from "@/features/groups/validate-create-group";
import { useDebouncedValue } from "@/features/inbox/use-debounced-value";
import { createGroup } from "@/lib/api/conversations";
import { isApiError } from "@/lib/api/error";
import { searchUsers } from "@/lib/api/users";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

type NewGroupProps = {
  onCreated?: () => void;
};

/**
 * Dialog to name a group and pick at least two other people.
 * @param props.onCreated - Switch the inbox to the Groups tab
 * @returns JSX.Element
 */
export function NewGroup({ onCreated }: NewGroupProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: me } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  const searchQuery = useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: open && debouncedQuery.length >= 1,
  });

  const create = useMutation({
    mutationFn: () =>
      createGroup({
        name: name.trim(),
        participantIds: selected.map((person) => person.id),
      }),
    onSuccess: async (group) => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      resetForm();
      setOpen(false);
      onCreated?.();
      router.push(`/app?c=${group.id}`);
    },
    onError: (caught) => {
      setError(
        isApiError(caught) ? caught.message : "Could not create that group.",
      );
    },
  });

  /**
   * Clear local dialog state.
   * @returns void
   */
  function resetForm() {
    setName("");
    setQuery("");
    setSelected([]);
    setError(null);
  }

  /**
   * Add or remove a person from the member list.
   * @param person - Search result
   * @returns void
   */
  function togglePerson(person: User) {
    setError(null);
    setSelected((current) =>
      current.some((item) => item.id === person.id)
        ? current.filter((item) => item.id !== person.id)
        : [...current, person],
    );
  }

  const results =
    searchQuery.data?.filter(
      (person) =>
        person.id !== me?.id &&
        !selected.some((item) => item.id === person.id),
    ) ?? [];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-200/80 hover:text-slate-900 active:scale-[0.99]"
      >
        <svg
          className="h-3.5 w-3.5 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Group (Min 3 Members)
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            resetForm();
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-md gap-5 rounded-2xl border border-landing-border bg-landing-surface p-6 text-landing-ink shadow-2xl sm:max-w-md"
        >
          <div className="flex items-center justify-between border-b border-landing-border pb-3">
            <div>
              <DialogTitle className="font-landing-display text-lg font-semibold text-landing-ink">
                Create Group Conversation
              </DialogTitle>
              <DialogDescription className="sr-only">
                Name the group and pick at least two other people.
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-slate-400 hover:text-slate-600"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <form
            className="space-y-4 text-xs"
            onSubmit={(event) => {
              event.preventDefault();
              const validationError = validateCreateGroup(
                name,
                selected.map((person) => person.id),
              );
              if (validationError) {
                setError(validationError);
                return;
              }
              create.mutate();
            }}
          >
            <div>
              <label
                htmlFor="group-name"
                className="mb-1.5 block text-[11px] font-bold tracking-wider text-landing-muted uppercase"
              >
                Group Name
              </label>
              <input
                id="group-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError(null);
                }}
                placeholder="e.g. Core Engineering"
                disabled={create.isPending}
                className={chatFieldClass}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="group-search"
                  className="text-[11px] font-bold tracking-wider text-landing-muted uppercase"
                >
                  Select Participants
                </label>
                <span className="font-landing-mono text-[10px] text-landing-muted">
                  (Min 2 other users)
                </span>
              </div>
              {selected.length > 0 ? (
                <ul className="mb-2 flex flex-wrap gap-1">
                  {selected.map((person) => (
                    <li key={person.id}>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full bg-landing-primary-soft px-2 py-0.5 text-[11px] font-medium text-landing-primary"
                        onClick={() => togglePerson(person)}
                        aria-label={`Remove ${person.name}`}
                      >
                        {person.name}
                        <span aria-hidden>×</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="relative mb-2.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  id="group-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search people by name or phone..."
                  disabled={create.isPending}
                  className={cn(chatFieldClass, "py-1.5 pr-3 pl-9")}
                />
              </div>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-landing-border bg-slate-50/50 p-2.5">
                {query.trim() ? (
                  <GroupSearchResults
                    isPending={searchQuery.isPending}
                    isError={searchQuery.isError}
                    results={results}
                    onSelect={togglePerson}
                    onRetry={() => void searchQuery.refetch()}
                  />
                ) : (
                  <p className="p-1 text-center text-[11px] text-landing-muted">
                    Search to add people
                  </p>
                )}
              </div>
            </div>

            {error ? <p className="text-xs text-rose-600">{error}</p> : null}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2 font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={create.isPending}
                className="rounded-xl bg-landing-primary px-5 py-2 font-medium text-white shadow-xs transition-all hover:bg-landing-primary-hover active:scale-95 disabled:opacity-60"
              >
                {create.isPending ? "Creating…" : "Create Group"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

type GroupSearchResultsProps = {
  isPending: boolean;
  isError: boolean;
  results: User[];
  onSelect: (person: User) => void;
  onRetry: () => void;
};

/**
 * People to add, under the group search field.
 * @param props - Query status and handlers
 * @returns JSX.Element
 */
function GroupSearchResults({
  isPending,
  isError,
  results,
  onSelect,
  onRetry,
}: GroupSearchResultsProps) {
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
    <ul className="divide-y divide-slate-100">
      {results.map((person) => (
        <li key={person.id}>
          <button
            type="button"
            onClick={() => onSelect(person)}
            className="flex w-full items-center justify-between rounded-lg p-1.5 text-left hover:bg-slate-100"
          >
            <span className="font-medium text-slate-800">{person.name}</span>
            <span className="font-landing-mono text-[10px] text-slate-400">
              {person.phone}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
