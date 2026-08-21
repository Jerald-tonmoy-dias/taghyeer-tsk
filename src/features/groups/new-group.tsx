"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/auth-provider";
import { validateCreateGroup } from "@/features/groups/validate-create-group";
import { useDebouncedValue } from "@/features/inbox/use-debounced-value";
import { createGroup } from "@/lib/api/conversations";
import { isApiError } from "@/lib/api/error";
import { searchUsers } from "@/lib/api/users";
import type { User } from "@/lib/types";

/**
 * Dialog to name a group and pick at least two other people.
 * @returns JSX.Element
 */
export function NewGroup() {
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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="w-full">
          <Users />
          New group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New group</DialogTitle>
          <DialogDescription>
            Name the group and pick at least two other people.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="group-name">Name</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              placeholder="Project team"
              disabled={create.isPending}
            />
          </div>
          {selected.length > 0 ? (
            <ul className="flex flex-wrap gap-1">
              {selected.map((person) => (
                <li key={person.id}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
                    onClick={() => togglePerson(person)}
                    aria-label={`Remove ${person.name}`}
                  >
                    {person.name}
                    <X className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="group-search">People</Label>
            <Input
              id="group-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or phone"
              disabled={create.isPending}
            />
            {query.trim() ? (
              <GroupSearchResults
                isPending={searchQuery.isPending}
                isError={searchQuery.isError}
                results={results}
                onSelect={togglePerson}
                onRetry={() => void searchQuery.refetch()}
              />
            ) : null}
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          <DialogFooter>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Creating…" : "Create group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
    return <p className="text-xs text-muted-foreground">Searching…</p>;
  }
  if (isError) {
    return (
      <button
        type="button"
        className="text-xs text-destructive underline"
        onClick={onRetry}
      >
        Search failed. Try again
      </button>
    );
  }
  if (results.length === 0) {
    return <p className="text-xs text-muted-foreground">No people found.</p>;
  }
  return (
    <ul className="max-h-40 overflow-y-auto rounded-md border">
      {results.map((person) => (
        <li key={person.id}>
          <button
            type="button"
            onClick={() => onSelect(person)}
            className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-muted"
          >
            <span className="font-medium">{person.name}</span>
            <span className="text-xs text-muted-foreground">{person.phone}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
