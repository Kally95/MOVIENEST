import { options } from "./TMDBClient";

export async function getMovieByName(query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
    options,
  );

  if (!response.ok) {
    throw new Error("TMDB search request failed");
  }

  return response.json();
}
