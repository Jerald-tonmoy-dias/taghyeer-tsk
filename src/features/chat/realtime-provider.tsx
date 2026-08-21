"use client";

import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { applyIncomingMessage } from "@/features/chat/apply-incoming-message";
import { useAuth } from "@/features/auth/auth-provider";
import type { SocketMessageNew } from "@/lib/api/payloads";
import { mapSocketMessage } from "@/lib/mappers";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { getToken } from "@/lib/api/token";

/**
 * Listen for `message:new` while signed in on `/app`. Landing does not mount this.
 * A socket drop does not log the user out.
 * @param props.children - Chat UI
 * @returns ReactNode
 */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { user, status } = useAuth();

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
    }

    socket.on("message:new", onMessageNew);

    return () => {
      socket.off("message:new", onMessageNew);
      disconnectSocket();
    };
  }, [queryClient, status, user]);

  return children;
}
