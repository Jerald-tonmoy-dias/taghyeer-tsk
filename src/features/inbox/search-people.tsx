"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/auth-provider";
import { useDebouncedValue } from "@/features/inbox/use-debounced-value";
import { createDirect } from "@/lib/api/conversations";
import { isApiError } from "@/lib/api/error";
import { searchUsers } from "@/lib/api/users";
import type { User } from "@/lib/types";

/**
 * Search people and start a 1:1. Empty query never hits the API.
 * @returns JSX.Element
 */
export function SearchPeople() {
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
    <div className="border-b px-3 py-2">
      <Input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setError(null);
        }}
        placeholder="Search name or phone"
        aria-label="Search people"
      />
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
      {error ? (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      ) : null}
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
    return <p className="mt-2 text-xs text-muted-foreground">Searching…</p>;
  }

  if (isError) {
    return (
      <button
        type="button"
        className="mt-2 text-xs text-destructive underline"
        onClick={onRetry}
      >
        Search failed. Try again
      </button>
    );
  }

  if (results.length === 0) {
    return (
      <p className="mt-2 text-xs text-muted-foreground">No people found.</p>
    );
  }

  return (
    <ul className="mt-2 max-h-48 overflow-y-auto rounded-md border">
      {results.map((person) => {
        const starting = startingUserId === person.id;
        return (
          <li key={person.id}>
            <button
              type="button"
              disabled={Boolean(startingUserId)}
              onClick={() => onSelect(person)}
              className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-60"
            >
              <span className="font-medium">
                {person.name}
                {starting ? " — opening…" : ""}
              </span>
              <span className="text-xs text-muted-foreground">{person.phone}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
