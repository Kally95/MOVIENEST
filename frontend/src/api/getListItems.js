import { authFetch } from "./authFetch.js";

export async function getListItems(listId) {
  const res = await authFetch(`/api/lists/${listId}/items`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Status:", res.status);
    console.error("Response:", errorText);
    throw new Error(`Fetching list items for list ${listId} failed`);
  }

  return res.json();
}
