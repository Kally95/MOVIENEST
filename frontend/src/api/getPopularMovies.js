import { options } from "./TMDBClient";

export async function getPopularMovies() {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options,
  );

  if (!response.ok) {
    throw new Error("TMDB popular movies request failed");
  }

  return response.json();
}
