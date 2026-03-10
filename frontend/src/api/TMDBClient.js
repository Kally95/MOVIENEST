const token = import.meta.env.VITE_TMDB_TOKEN;

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
};
