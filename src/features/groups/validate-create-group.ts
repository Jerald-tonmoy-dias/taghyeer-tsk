import type { UserId } from "@/lib/types";

/**
 * Client checks before `POST /conversations/group`.
 * @param name - Group name
 * @param participantIds - Other members (not the creator)
 * @returns string | null — error message, or null if valid
 */
export function validateCreateGroup(
  name: string,
  participantIds: UserId[],
): string | null {
  if (!name.trim()) {
    return "Enter a group name";
  }
  if (participantIds.length < 2) {
    return "Pick at least two other people";
  }
  return null;
}
