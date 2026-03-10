import { Link, useParams, useLocation } from "react-router-dom";
import "./ListDetails.css";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getListItems } from "../api/getListItems";
import { getMovieById } from "../api/getMovieById";
import popcornFallback from "../assets/popcorn.jpg";

export default function ListDetails() {
  const { listId } = useParams();

  const location = useLocation();

  const { list_name } = location.state || {};

  const { data } = useQuery({
    queryKey: ["list", listId],
    queryFn: () => getListItems(listId),
  });

  const listItemsQueries = useQueries({
    queries: (data ?? []).map((item) => ({
      queryKey: ["listItem", item.movie_id],
      queryFn: () => getMovieById(item.movie_id),
      enabled: !!item.movie_id,
      retry: false,
    })),
  });

  const listMovieData = listItemsQueries
    .map((query) => query.data)
    .filter(Boolean);

  return (
    <section className="list-details-page">
      <h1 className="section-title">{list_name}</h1>
      <div className="list-details-grid">
        {listMovieData.map((movie) => {
          return (
            <Link
              to={`/movie/${movie.id}`}
              className="movie-details-card"
              key={movie.id}
            >
              <img
                className="movie-details-card__poster"
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                    : popcornFallback
                }
                alt={movie.original_title}
              />
              <h3 className="movie-details-card__title">
                {movie.original_title}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
