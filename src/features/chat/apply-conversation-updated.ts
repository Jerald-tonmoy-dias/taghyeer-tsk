import type { QueryClient } from "@tanstack/react-query";
import { upsertGroupInInbox } from "@/features/chat/upsert-group";
import type { Conversation, GroupConversation } from "@/lib/types";

/**
 * Apply a live `conversation:updated` payload to the inbox cache.
 * @param queryClient - App Query client
 * @param group - Mapped group
 * @param stillMember - Whether the signed-in user is still in the group
 * @returns void
 */
export function applyConversationUpdated(
  queryClient: QueryClient,
  group: GroupConversation,
  stillMember: boolean,
): void {
  queryClient.setQueryData<Conversation[]>(["conversations"], (inbox) => {
    if (!stillMember) {
      return inbox?.filter((item) => item.id !== group.id) ?? inbox;
    }
    return upsertGroupInInbox(inbox, group);
  });
}
