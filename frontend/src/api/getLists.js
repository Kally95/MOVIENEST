import { authFetch } from "./authFetch";

export async function getLists() {
  const res = await authFetch("/api/lists/", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Fetching lists failed");
  }

  return res.json();
}
