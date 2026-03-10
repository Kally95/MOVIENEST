import { getAuthHeaders } from "./authHeaders";

export async function addMovieToList(data, listId) {
  const res = await fetch(`/api/lists/${listId}/items`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Status:", res.status);
    console.error("Response:", errorText);
    throw new Error("Adding movie to list failed");
  }

  return res.json();
}
