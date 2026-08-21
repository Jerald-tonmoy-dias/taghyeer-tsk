import { io, type Socket } from "socket.io-client";

const DEFAULT_SOCKET_URL = "https://frontend-task-chatapp.onrender.com";

let socket: Socket | null = null;

/**
 * Socket.io origin (host root, not `/api`).
 * @returns string
 */
function getSocketUrl(): string {
  const origin = process.env.NEXT_PUBLIC_SOCKET_URL ?? DEFAULT_SOCKET_URL;
  return origin.replace(/\/$/, "");
}

/**
 * Connect with the JWT handshake. Reuses one client for the tab.
 * @param token - Session JWT
 * @returns Socket
 */
export function connectSocket(token: string): Socket {
  if (socket) {
    socket.auth = { token };
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  socket = io(getSocketUrl(), {
    auth: { token },
    autoConnect: true,
  });
  return socket;
}

/**
 * Drop the socket. Does not clear the JWT or log the user out.
 * @returns void
 */
export function disconnectSocket(): void {
  socket?.removeAllListeners();
  socket?.disconnect();
  socket = null;
}
