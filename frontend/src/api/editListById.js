import { getAuthHeaders } from "./authHeaders";

export async function editListById({ id, name, visibility }) {
  const res = await fetch(`/api/lists/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, visibility }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Editing list failed");
  }

  return data;
}
