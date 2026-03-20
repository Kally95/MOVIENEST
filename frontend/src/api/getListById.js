import { authFetch } from "./authFetch.js";

export async function getListById(listId) {
  const res = await authFetch(`/api/lists/${listId}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch list ${listId}: ${res.status}`);
  }

  return res.json();
}
