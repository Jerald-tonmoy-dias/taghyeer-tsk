export type UserId = string;
export type ConversationId = string;
export type MessageId = string;

export type User = {
  id: UserId;
  name: string;
  phone: string;
};

export type MessageStatus = "sending" | "sent" | "failed";

export type Message = {
  id: MessageId;
  conversationId: ConversationId;
  senderId: UserId;
  text: string;
  /** Milliseconds since 1 Jan 1970 (same unit for REST and socket). */
  createdAt: number;
  status?: MessageStatus;
};

export type LastMessage = {
  text: string;
  senderId: UserId;
  /** Milliseconds since 1 Jan 1970. */
  createdAt: number;
};

export type DirectConversation = {
  id: ConversationId;
  type: "direct";
  participant: User;
  lastMessage?: LastMessage;
  updatedAt: string;
};

export type GroupConversation = {
  id: ConversationId;
  type: "group";
  name: string;
  createdBy: UserId;
  admins: UserId[];
  participants: User[];
  lastMessage?: LastMessage;
  updatedAt: string;
};

export type Conversation = DirectConversation | GroupConversation;

export type Session = {
  token: string;
  user: User;
};

export type CreatedDirect = {
  id: ConversationId;
  participantIds: UserId[];
  createdAt: string;
};

export type MessagePage = {
  messages: Message[];
  hasMore: boolean;
};

export type ApiErrorCode =
  | "NO_TOKEN"
  | "INVALID_TOKEN"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "UNKNOWN_USER"
  | string;

export type ApiErrorBody = {
  error: {
    message: string;
    code: ApiErrorCode;
    details?: { path: string; message: string }[];
  };
};
