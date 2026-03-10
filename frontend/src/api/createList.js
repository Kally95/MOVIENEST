import { getAuthHeaders } from "./authHeaders";

export async function createList(list) {
  const res = await fetch("/api/lists/", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(list),
  });

  if (!res.ok) {
    throw new Error("Failed to create list");
  }

  return res.json();
}
