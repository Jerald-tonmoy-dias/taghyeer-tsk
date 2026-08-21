import { apiRequest } from "@/lib/api/client";
import type { ApiLoginResponse, ApiUser } from "@/lib/api/dto";
import { mapSession, mapUser } from "@/lib/mappers";
import type { Session, User } from "@/lib/types";

/**
 * Log in or register with phone + name. Does not send a token.
 * @param input.phone - User phone
 * @param input.name - Display name
 * @returns Promise<Session>
 */
export async function login(input: {
  phone: string;
  name: string;
}): Promise<Session> {
  const payload = await apiRequest<ApiLoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: { phone: input.phone, name: input.name },
  });
  return mapSession(payload);
}

/**
 * Restore the current user with the stored JWT (`GET /auth/me`).
 * @returns Promise<User>
 */
export async function getMe(): Promise<User> {
  const payload = await apiRequest<ApiUser>("/auth/me");
  return mapUser(payload);
}
