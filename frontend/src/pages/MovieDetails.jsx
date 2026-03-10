import { useParams } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { getMovieById } from "../api/getMovieById";
import { getLists } from "../api/getLists";
import { addMovieToList } from "../api/addMovieToList";
import "./MovieDetails.css";
import seatsFallback from "../assets/seats.jpg";
import popcornFallback from "../assets/popcorn.jpg";
import ListBullet from "../components/ListBullet";
import WatchlistIcon from "../components/WatchlistIcon";
import FavouriteIcon from "../components/FavouriteIcon";
import Modal from "../components/Modal";
import CustomListModal from "../components/CustomListModal";
import { useAuth } from "../contexts/AuthContext";
import { getListItems } from "../api/getListItems";
import { removeMovieFromList } from "../api/removeMovieFromList";

export default function MovieDetails() {
  const { movieId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthed } = useAuth();

  const movieQuery = useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: () => getMovieById(movieId),
    enabled: !!movieId,
  });

  const listQuery = useQuery({
    queryKey: ["lists"],
    queryFn: getLists,
  });

  const favouritesList = listQuery.data?.find(
    (list) => list.list_type === "FAVOURITES",
  );
  const favouritesListId = favouritesList?.id;
  4;
  const favouritesItemsQuery = useQuery({
    queryKey: ["listItems", favouritesListId],
    queryFn: () => getListItems(favouritesListId),
    enabled: !!favouritesListId,
  });

  const watchlistList = listQuery.data?.find(
    (list) => list.list_type === "WATCHLIST",
  );

  const watchlistListId = watchlistList?.id;

  const watchlistItemsQuery = useQuery({
    queryKey: ["listItems", watchlistListId],
    queryFn: () => getListItems(watchlistListId),
    enabled: !!watchlistListId,
  });

  const customListsOnly =
    listQuery.data?.filter((list) => {
      return list.list_type !== "WATCHLIST" && list.list_type !== "FAVOURITES";
    }) ?? [];

  const customListItemsQueries = useQueries({
    queries: customListsOnly.map((list) => ({
      queryKey: ["listItems", list.id],
      queryFn: () => getListItems(list.id),
      enabled: !!list.id,
    })),
  });

  const customListsWithMovieState = customListsOnly.map((list, index) => {
    const items = customListItemsQueries[index].data ?? [];

    const matchingItem =
      items.find((item) => item.movie_id === Number(movieId)) ?? null;

    return {
      ...list,
      hasMovie: !!matchingItem,
      matchingItem,
    };
  });

  const favouriteListItem =
    favouritesItemsQuery?.data?.find(
      (item) => item.movie_id === Number(movieId),
    ) ?? false;

  const watchlistListItem =
    watchlistItemsQuery?.data?.find(
      (item) => item.movie_id === Number(movieId),
    ) ?? false;

  const isFavourite = !!favouriteListItem;
  const isInWatchlist = !!watchlistListItem;

  const addMovieHandler = async (listId, closeModal = false) => {
    if (!listId) {
      console.error("No valid list id was provided.");
      return;
    }

    try {
      const result = await addMovieToList(
        { movie_id: Number(movieId) },
        listId,
      );
      console.log(result);

      if (closeModal) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavourite = async () => {
    if (!favouritesListId) return;

    try {
      if (!isFavourite) {
        await addMovieToList({ movie_id: Number(movieId) }, favouritesListId);
      } else {
        await removeMovieFromList(favouriteListItem.id, favouritesListId);
      }

      await favouritesItemsQuery.refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleWatchlist = async () => {
    if (!watchlistListId) return;

    try {
      if (!isInWatchlist) {
        await addMovieToList({ movie_id: Number(movieId) }, watchlistListId);
      } else {
        await removeMovieFromList(watchlistListItem.id, watchlistListId);
      }

      await watchlistItemsQuery.refetch();
    } catch (error) {
      console.error(error);
    }
  };

  if (movieQuery.isLoading) return <div>Loading...</div>;
  if (movieQuery.isError) return <div>{movieQuery.error.message}</div>;

  const trailer = movieQuery.data?.videos?.results?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  const key = trailer?.key;

  const backdropUrl = movieQuery.data?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movieQuery.data.backdrop_path}`
    : seatsFallback;

  const posterUrl = movieQuery.data?.poster_path
    ? `https://image.tmdb.org/t/p/original${movieQuery.data.poster_path}`
    : popcornFallback;

  const runtime = Number(movieQuery.data?.runtime);

  return (
    <section className="details-container">
      <img
        className="details-backdrop"
        src={backdropUrl}
        alt={`${movieQuery.data?.title} backdrop`}
      />

      <div className="details-hero">
        <div className="details-hero-content">
          <img
            className="details-poster"
            src={posterUrl}
            alt={movieQuery.data?.title}
          />

          <div className="details-meta">
            <div className="details-top">
              <h1 className="details-hero-title">{movieQuery.data?.title}</h1>

              {movieQuery.data?.release_date && (
                <span className="details-hero-date">
                  📅 {movieQuery.data.release_date}
                </span>
              )}

              {runtime > 0 && (
                <span className="details-hero-runtime">⏱️ {runtime}m</span>
              )}
            </div>

            {movieQuery.data?.tagline && (
              <p className="details-tagline">{movieQuery.data.tagline}</p>
            )}

            {movieQuery.data?.overview ? (
              <p className="details-hero-overview">
                {movieQuery.data.overview}
              </p>
            ) : (
              <p className="details-hero-overview">No overview available.</p>
            )}

            <div className="details-genres">
              {movieQuery.data?.genres?.map((genre) => (
                <span key={genre.id} className="details-hero-genre">
                  {genre.name}
                </span>
              ))}

              {isAuthed && (
                <div className="details-actions">
                  <span title="Add to a list">
                    <ListBullet
                      onClick={() => setIsOpen(true)}
                      className="details-action-icons"
                    />
                  </span>

                  <span title="Add to Watchlist">
                    <WatchlistIcon
                      onClick={toggleWatchlist}
                      className={`details-action-icons ${isInWatchlist ? "active" : ""}`}
                    />
                  </span>

                  <span title="Add to Favourites">
                    <FavouriteIcon
                      onClick={toggleFavourite}
                      className={`details-action-icons ${isFavourite ? "active" : ""}`}
                    />
                  </span>
                </div>
              )}
            </div>

            {key && (
              <div className="details-trailer">
                <iframe
                  src={`https://www.youtube.com/embed/${key}`}
                  allowFullScreen
                  title={`${movieQuery.data?.title} trailer`}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CustomListModal
          listQuery={listQuery}
          addMovieHandler={addMovieHandler}
          customListsWithMovieState={customListsWithMovieState}
        />
      </Modal>
    </section>
  );
}
