import { apiRequest } from "@/lib/api/client";
import type { ApiUser } from "@/lib/api/dto";
import { mapUser } from "@/lib/mappers";
import type { User } from "@/lib/types";

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
