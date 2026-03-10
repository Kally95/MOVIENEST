import { options } from "./TMDBClient";

export async function getTrendingMovies() {
  const response = await fetch(
    "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
    options,
  );

  if (!response.ok) {
    throw new Error("TMDB trending movies request failed");
  }

  return response.json();
}
