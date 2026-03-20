import { authFetch } from "./authFetch.js";

export async function removeList(listId) {
  const res = await authFetch(`/api/lists/${listId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Status:", res.status);
    console.error("Response:", errorText);
    throw new Error("Removing list failed");
  }

  return true;
}
