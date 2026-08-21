import { apiRequest } from "@/lib/api/client";
import type {
  ApiCreatedDirect,
  ApiGroupConversation,
  ApiInbox,
  ApiMessagePage,
} from "@/lib/api/dto";
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

export async function listConversations(): Promise<Conversation[]> {
  const payload = await apiRequest<ApiInbox>("/conversations");
  return payload.data.map(mapConversation);
}

export async function createDirect(userId: UserId): Promise<CreatedDirect> {
  const payload = await apiRequest<ApiCreatedDirect>("/conversations", {
    method: "POST",
    body: { userId },
  });
  return mapCreatedDirect(payload);
}

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
