import { getAuthHeaders } from "./authHeaders";

export async function getListById(listId) {
  const res = await fetch(`/api/lists/${listId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch list ${listId}: ${res.status}`);
  }

  return res.json();
}
