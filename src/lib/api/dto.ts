export type ApiUser = {
  _id: string;
  name: string;
  phone: string;
  createdAt?: string;
};

export type ApiLastMessage = {
  text?: string;
  sender?: string;
  createdAt?: string;
};

export type ApiDirectConversation = {
  _id: string;
  type: "direct";
  updatedAt: string;
  lastMessage?: ApiLastMessage;
  participant: ApiUser;
};

export type ApiGroupConversation = {
  _id: string;
  type: "group";
  name: string;
  createdBy: string;
  admins: string[];
  updatedAt?: string;
  createdAt?: string;
  lastMessage?: ApiLastMessage;
  participants: ApiUser[];
};

export type ApiConversation = ApiDirectConversation | ApiGroupConversation;

export type ApiMessage = {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string;
};

export type ApiCreatedDirect = {
  _id: string;
  participants: string[];
  createdAt: string;
};

export type ApiLoginResponse = {
  token: string;
  user: ApiUser;
};

export type ApiMessagePage = {
  messages: ApiMessage[];
  hasMore: boolean;
};

export type ApiInbox = {
  data: ApiConversation[];
};

/** Socket.io `message:new` — `id` + numeric `createdAt`, not REST `_id` + ISO. */
export type SocketMessageNew = {
  id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: number;
};
