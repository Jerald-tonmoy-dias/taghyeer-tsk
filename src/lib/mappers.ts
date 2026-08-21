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

export function toEpochMs(value: string | number): number {
  if (typeof value === "number") {
    return value;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function mapUser(user: ApiUser): User {
  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
  };
}

export function mapSession(payload: ApiLoginResponse): Session {
  return {
    token: payload.token,
    user: mapUser(payload.user),
  };
}

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

export function mapConversation(conversation: ApiConversation): Conversation {
  if (conversation.type === "direct") {
    return mapDirectConversation(conversation);
  }
  return mapGroupConversation(conversation);
}

export function mapCreatedDirect(payload: ApiCreatedDirect): CreatedDirect {
  return {
    id: payload._id,
    participantIds: payload.participants,
    createdAt: payload.createdAt,
  };
}

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

export function mapMessagePage(payload: ApiMessagePage): MessagePage {
  return {
    messages: payload.messages.map(mapMessage),
    hasMore: payload.hasMore,
  };
}
