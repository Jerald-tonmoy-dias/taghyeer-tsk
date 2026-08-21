import { apiRequest } from "@/lib/api/client";
import type { ApiUser } from "@/lib/api/payloads";
import { mapUser } from "@/lib/mappers";
import type { User } from "@/lib/types";

/**
 * Search people by name or phone. Empty `q` does not call the API.
 * The live API is case-sensitive and exact: `ada` and `Ada` can return different lists.
 * @param q - Search query
 * @returns Promise<User[]>
 */
export async function searchUsers(q: string): Promise<User[]> {
  const query = q.trim();
  if (!query) {
    return [];
  }

  const payload = await apiRequest<ApiUser[]>("/users/search", {
    query: { q: query },
  });
  return payload.map(mapUser);
}
