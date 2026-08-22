"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { applyConversationUpdated } from "@/features/chat/apply-conversation-updated";
import { applyIncomingMessage } from "@/features/chat/apply-incoming-message";
import {
  clearAllUnread,
  markConversationUnread,
} from "@/features/inbox/unread-store";
import { useAuth } from "@/features/auth/auth-provider";
import type { ApiGroupConversation, SocketMessageNew } from "@/lib/api/payloads";
import { mapGroupConversation, mapSocketMessage } from "@/lib/mappers";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { getToken } from "@/lib/api/token";

type SocketStatus = {
  connected: boolean;
};

const SocketStatusContext = createContext<SocketStatus>({ connected: false });

/**
 * Whether this tab’s socket is up. Not other-user presence.
 * @returns SocketStatus
 */
export function useSocketStatus(): SocketStatus {
  return useContext(SocketStatusContext);
}

/**
 * Listen for live messages and group updates while signed in on `/app`.
 * A socket drop does not log the user out.
 * @param props.children - Chat UI
 * @returns ReactNode
 */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, status } = useAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !user) {
      disconnectSocket();
      return;
    }

    const token = getToken();
    if (!token) {
      disconnectSocket();
      return;
    }

    const myUserId = user.id;
    const socket = connectSocket(token);

    /**
     * Map a socket payload and merge it into inbox + open thread caches.
     * @param payload - Raw `message:new` body
     * @returns void
     */
    function onMessageNew(payload: SocketMessageNew) {
      const message = mapSocketMessage(payload);
      applyIncomingMessage(queryClient, message, myUserId);
      if (message.senderId !== myUserId) {
        markConversationUnread(message.conversationId);
      }
    }

    /**
     * Replace a group in the inbox. Leave the thread if we were removed.
     * @param payload - Raw `conversation:updated` body
     * @returns void
     */
    function onConversationUpdated(payload: ApiGroupConversation) {
      const group = mapGroupConversation(payload);
      const stillMember = group.participants.some(
        (person) => person.id === myUserId,
      );
      applyConversationUpdated(queryClient, group, stillMember);
      if (!stillMember && typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("c") === group.id) {
          router.replace("/app");
        }
      }
    }

    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    socket.on("message:new", onMessageNew);
    socket.on("conversation:updated", onConversationUpdated);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    const connectedFrame = requestAnimationFrame(() => {
      if (socket.connected) {
        setConnected(true);
      }
    });

    return () => {
      cancelAnimationFrame(connectedFrame);
      socket.off("message:new", onMessageNew);
      socket.off("conversation:updated", onConversationUpdated);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      setConnected(false);
      clearAllUnread();
      disconnectSocket();
    };
  }, [queryClient, router, status, user]);

  return (
    <SocketStatusContext.Provider value={{ connected }}>
      {children}
    </SocketStatusContext.Provider>
  );
}
