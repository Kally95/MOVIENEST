export async function getMovieById(movieId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits,videos`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch movie ${movieId}: ${res.status}`);
  }

  return res.json();
}
