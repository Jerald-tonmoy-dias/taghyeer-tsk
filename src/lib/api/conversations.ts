import { apiRequest } from "@/lib/api/client";
import type {
  ApiCreatedDirect,
  ApiGroupConversation,
  ApiInbox,
  ApiMessagePage,
} from "@/lib/api/payloads";
import {
  mapConversation,
  mapCreatedDirect,
  mapGroupConversation,
  mapMessagePage,
} from "@/lib/mappers";
import type {
  Conversation,
  ConversationId,
  CreatedDirect,
  GroupConversation,
  MessageId,
  MessagePage,
  UserId,
} from "@/lib/types";

/**
 * List inbox conversations (direct + group).
 * @returns Promise<Conversation[]>
 */
export async function listConversations(): Promise<Conversation[]> {
  const payload = await apiRequest<ApiInbox>("/conversations");
  return payload.data.map(mapConversation);
}

/**
 * Start or open a 1:1 chat with another user.
 * @param userId - The other user's id
 * @returns Promise<CreatedDirect>
 */
export async function createDirect(userId: UserId): Promise<CreatedDirect> {
  const payload = await apiRequest<ApiCreatedDirect>("/conversations", {
    method: "POST",
    body: { userId },
  });
  return mapCreatedDirect(payload);
}

/**
 * Create a group. `participantIds` are other members (at least two).
 * @param input.name - Group name
 * @param input.participantIds - Other user ids
 * @returns Promise<GroupConversation>
 */
export async function createGroup(input: {
  name: string;
  participantIds: UserId[];
}): Promise<GroupConversation> {
  const payload = await apiRequest<ApiGroupConversation>(
    "/conversations/group",
    {
      method: "POST",
      body: {
        name: input.name,
        participantIds: input.participantIds,
      },
    },
  );
  return mapGroupConversation(payload);
}

/**
 * Load a page of messages (API returns newest first).
 * @param conversationId - Conversation id
 * @param options.limit - Page size
 * @param options.before - Message id cursor for older pages
 * @returns Promise<MessagePage>
 */
export async function getMessages(
  conversationId: ConversationId,
  options: { limit?: number; before?: MessageId } = {},
): Promise<MessagePage> {
  const payload = await apiRequest<ApiMessagePage>(
    `/conversations/${conversationId}/messages`,
    {
      query: {
        limit: options.limit,
        before: options.before,
      },
    },
  );
  return mapMessagePage(payload);
}

/**
 * Rename a group. Admin only.
 * @param conversationId - Group id
 * @param name - New title
 * @returns Promise<GroupConversation>
 */
export async function renameGroup(
  conversationId: ConversationId,
  name: string,
): Promise<GroupConversation> {
  const payload = await apiRequest<ApiGroupConversation>(
    `/conversations/${conversationId}`,
    {
      method: "PATCH",
      body: { name },
    },
  );
  return mapGroupConversation(payload);
}

/**
 * Add people to a group. Admin only.
 * @param conversationId - Group id
 * @param userIds - Users to add
 * @returns Promise<GroupConversation>
 */
export async function addParticipants(
  conversationId: ConversationId,
  userIds: UserId[],
): Promise<GroupConversation> {
  const payload = await apiRequest<ApiGroupConversation>(
    `/conversations/${conversationId}/participants`,
    {
      method: "POST",
      body: { userIds },
    },
  );
  return mapGroupConversation(payload);
}

/**
 * Remove a member, or leave when `userId` is the current user.
 * @param conversationId - Group id
 * @param userId - Member to remove, or self to leave
 * @returns Promise<GroupConversation>
 */
export async function removeParticipant(
  conversationId: ConversationId,
  userId: UserId,
): Promise<GroupConversation> {
  const payload = await apiRequest<ApiGroupConversation>(
    `/conversations/${conversationId}/participants/${userId}`,
    { method: "DELETE" },
  );
  return mapGroupConversation(payload);
}
