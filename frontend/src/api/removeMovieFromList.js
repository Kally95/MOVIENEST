import { authFetch } from "./authFetch.js";

export async function removeMovieFromList(itemId, listId) {
  const res = await authFetch(`/api/lists/${listId}/items/${itemId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Status:", res.status);
    console.error("Response:", errorText);
    throw new Error("Removing movie from list failed");
  }

  return true;
}
