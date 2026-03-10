import { getAuthHeaders } from "./authHeaders";

export async function getListItems(listId) {
  const res = await fetch(`/api/lists/${listId}/items`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Status:", res.status);
    console.error("Response:", errorText);
    throw new Error(`Fetching list items for list ${listId} failed`);
  }

  return res.json();
}
