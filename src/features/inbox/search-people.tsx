"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-provider";
import { chatFieldClass } from "@/features/chat/chat-ui";
import { useDebouncedValue } from "@/features/inbox/use-debounced-value";
import { createDirect } from "@/lib/api/conversations";
import { isApiError } from "@/lib/api/error";
import { searchUsers } from "@/lib/api/users";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

type SearchPeopleProps = {
  onStarted?: () => void;
};

/**
 * Search people and start a 1:1. Empty query never hits the API.
 * @param props.onStarted - Switch the inbox to the Direct tab
 * @returns JSX.Element
 */
export function SearchPeople({ onStarted }: SearchPeopleProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: me } = useAuth();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  const searchQuery = useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length >= 1,
  });

  const startChat = useMutation({
    mutationFn: (userId: string) => createDirect(userId),
    onSuccess: async (created) => {
      setError(null);
      setQuery("");
      onStarted?.();
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      router.push(`/app?c=${created.id}`);
    },
    onError: (caught) => {
      setError(
        isApiError(caught) ? caught.message : "Could not start that chat.",
      );
    },
  });

  const results =
    searchQuery.data?.filter((person) => person.id !== me?.id) ?? [];

  return (
    <div className="relative">
      <div className="relative">
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
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setError(null);
          }}
          placeholder="Search users by name or phone..."
          aria-label="Search people"
          className={cn(chatFieldClass, "py-1.5 pr-3 pl-9")}
        />
      </div>
      {query.trim() ? (
        <SearchResults
          isPending={searchQuery.isPending}
          isError={searchQuery.isError}
          results={results}
          startingUserId={startChat.isPending ? startChat.variables : undefined}
          onSelect={(person) => startChat.mutate(person.id)}
          onRetry={() => void searchQuery.refetch()}
        />
      ) : null}
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

type SearchResultsProps = {
  isPending: boolean;
  isError: boolean;
  results: User[];
  startingUserId?: string;
  onSelect: (person: User) => void;
  onRetry: () => void;
};

/**
 * Dropdown-style results under the search field.
 * @param props - Query status and handlers
 * @returns JSX.Element
 */
function SearchResults({
  isPending,
  isError,
  results,
  startingUserId,
  onSelect,
  onRetry,
}: SearchResultsProps) {
  if (isPending) {
    return <p className="mt-2 text-xs text-landing-muted">Searching…</p>;
  }

  if (isError) {
    return (
      <button
        type="button"
        className="mt-2 text-xs text-rose-600 underline"
        onClick={onRetry}
      >
        Search failed. Try again
      </button>
    );
  }

  if (results.length === 0) {
    return <p className="mt-2 text-xs text-landing-muted">No people found.</p>;
  }

  return (
    <ul className="absolute z-20 mt-1.5 max-h-48 w-full overflow-y-auto rounded-xl border border-landing-border bg-landing-surface shadow-lg">
      {results.map((person) => {
        const starting = startingUserId === person.id;
        return (
          <li key={person.id}>
            <button
              type="button"
              disabled={Boolean(startingUserId)}
              onClick={() => onSelect(person)}
              className="flex w-full flex-col items-start px-3 py-2 text-left text-xs hover:bg-slate-50 disabled:opacity-60"
            >
              <span className="font-medium text-landing-ink">
                {person.name}
                {starting ? " — opening…" : ""}
              </span>
              <span className="font-landing-mono text-[10px] text-landing-muted">
                {person.phone}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
