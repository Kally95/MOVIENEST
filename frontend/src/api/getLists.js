import { getAuthHeaders } from "./authHeaders";

export async function getLists() {
  const res = await fetch("/api/lists/", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Fetching lists failed");
  }

  return res.json();
}
