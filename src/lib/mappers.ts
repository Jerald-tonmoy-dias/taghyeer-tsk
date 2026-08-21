import type {
  ApiConversation,
  ApiCreatedDirect,
  ApiDirectConversation,
  ApiGroupConversation,
  ApiLastMessage,
  ApiLoginResponse,
  ApiMessage,
  ApiMessagePage,
  ApiUser,
  SocketMessageNew,
} from "@/lib/api/dto";
import type {
  Conversation,
  CreatedDirect,
  DirectConversation,
  GroupConversation,
  LastMessage,
  Message,
  MessagePage,
  Session,
  User,
} from "@/lib/types";

/**
 * Convert an ISO date string or epoch ms to epoch milliseconds.
 * @param value - ISO timestamp or numeric epoch ms
 * @returns number
 */
export function toEpochMs(value: string | number): number {
  if (typeof value === "number") {
    return value;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Map a REST user (`_id`) to the domain user (`id`).
 * @param user - API user payload
 * @returns User
 */
export function mapUser(user: ApiUser): User {
  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
  };
}

/**
 * Map a login response to a session (token + user).
 * @param payload - `POST /auth/login` body
 * @returns Session
 */
export function mapSession(payload: ApiLoginResponse): Session {
  return {
    token: payload.token,
    user: mapUser(payload.user),
  };
}

/**
 * Map inbox `lastMessage`, treating `{}` as missing.
 * @param value - API last-message object or empty object
 * @returns LastMessage | undefined
 */
function mapLastMessage(value?: ApiLastMessage): LastMessage | undefined {
  if (!value?.text || !value.sender || !value.createdAt) {
    return undefined;
  }
  return {
    text: value.text,
    senderId: value.sender,
    createdAt: toEpochMs(value.createdAt),
  };
}

/**
 * Map a 1:1 inbox row to a direct conversation.
 * @param conversation - API direct conversation
 * @returns DirectConversation
 */
export function mapDirectConversation(
  conversation: ApiDirectConversation,
): DirectConversation {
  return {
    id: conversation._id,
    type: "direct",
    participant: mapUser(conversation.participant),
    lastMessage: mapLastMessage(conversation.lastMessage),
    updatedAt: conversation.updatedAt,
  };
}

/**
 * Map a group inbox/create payload to a group conversation.
 * @param conversation - API group conversation
 * @returns GroupConversation
 */
export function mapGroupConversation(
  conversation: ApiGroupConversation,
): GroupConversation {
  return {
    id: conversation._id,
    type: "group",
    name: conversation.name,
    createdBy: conversation.createdBy,
    admins: conversation.admins,
    participants: conversation.participants.map(mapUser),
    lastMessage: mapLastMessage(conversation.lastMessage),
    updatedAt: conversation.updatedAt ?? conversation.createdAt ?? "",
  };
}

/**
 * Map an inbox item by `type` (direct or group).
 * @param conversation - API conversation
 * @returns Conversation
 */
export function mapConversation(conversation: ApiConversation): Conversation {
  if (conversation.type === "direct") {
    return mapDirectConversation(conversation);
  }
  return mapGroupConversation(conversation);
}

/**
 * Map the thin `POST /conversations` response.
 * @param payload - Created 1:1 with participant id strings
 * @returns CreatedDirect
 */
export function mapCreatedDirect(payload: ApiCreatedDirect): CreatedDirect {
  return {
    id: payload._id,
    participantIds: payload.participants,
    createdAt: payload.createdAt,
  };
}

/**
 * Map a REST message (`_id`, ISO `createdAt`) to the domain message.
 * @param message - API message
 * @returns Message
 */
export function mapMessage(message: ApiMessage): Message {
  return {
    id: message._id,
    conversationId: message.conversation,
    senderId: message.sender,
    text: message.text,
    createdAt: toEpochMs(message.createdAt),
    status: "sent",
  };
}

/**
 * Map a socket `message:new` payload (`id`, numeric `createdAt`).
 * @param payload - Socket message event
 * @returns Message
 */
export function mapSocketMessage(payload: SocketMessageNew): Message {
  return {
    id: payload.id,
    conversationId: payload.conversation,
    senderId: payload.sender,
    text: payload.text,
    createdAt: toEpochMs(payload.createdAt),
    status: "sent",
  };
}

/**
 * Map a message history page (newest-first from the API).
 * @param payload - `{ messages, hasMore }`
 * @returns MessagePage
 */
export function mapMessagePage(payload: ApiMessagePage): MessagePage {
  return {
    messages: payload.messages.map(mapMessage),
    hasMore: payload.hasMore,
  };
}
