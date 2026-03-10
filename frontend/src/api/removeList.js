import { getAuthHeaders } from "./authHeaders";

export async function removeList(listId) {
  const res = await fetch(`/api/lists/${listId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Status:", res.status);
    console.error("Response:", errorText);
    throw new Error("Removing movie from list failed");
  }

  return true;
}
