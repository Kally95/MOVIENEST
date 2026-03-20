import { authFetch } from "./authFetch";

export async function createList(list) {
  const res = await authFetch("/api/lists/", {
    method: "POST",
    body: JSON.stringify(list),
  });

  if (!res.ok) {
    throw new Error("Failed to create list");
  }

  return res.json();
}
