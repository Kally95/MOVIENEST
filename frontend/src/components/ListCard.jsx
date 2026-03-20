import { useQueries, useQueryClient } from "@tanstack/react-query";
import { getMovieById } from "../api/getMovieById";
import Button from "../components/Button";
import "./ListCard.css";
import { Link } from "react-router-dom";
import popcornFallback from "../assets/popcorn.jpg";
import { removeMovieFromList } from "../api/removeMovieFromList";
import { removeList } from "../api/removeList";
import Modal from "./Modal";
import EditListForm from "../components/EditListForm";
import { useState } from "react";

export default function ListCard({ list, listItems = [] }) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState();

  const movieQueries = useQueries({
    queries: listItems.map((item) => ({
      queryKey: ["movieItem", item.movie_id],
      queryFn: () => getMovieById(item.movie_id),
      enabled: !!item.movie_id,
      retry: false,
    })),
  });

  const moviesWithListItems = movieQueries
    .map((query, index) => {
      const movie = query.data;
      const listItem = listItems[index];

      if (!movie || !listItem) return null;

      return {
        movie,
        listItemId: listItem.id,
      };
    })
    .filter(Boolean);

  const previewMovies = moviesWithListItems.slice(0, 12);

  async function handleRemove(listItemId) {
    try {
      await removeMovieFromList(listItemId, list.id);

      await queryClient.invalidateQueries({
        queryKey: ["listItems", list.id],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteList() {
    try {
      await removeList(list.id);

      await queryClient.invalidateQueries({
        queryKey: ["lists"],
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <article className="list-card">
      <div className="list-card__header">
        <div>
          <h2 className="list-card__title">{list.name}</h2>

          <div className="list-card__meta">
            <span className="list-card__count">
              {listItems.length} items - {list.visibility}
            </span>
          </div>
        </div>
      </div>

      <div className="list-card__preview">
        {previewMovies.map((item) => (
          <div className="list-card__movie" key={item.listItemId}>
            <Link
              className="list-card__movie-link"
              to={`/movie/${item.movie.id}`}
            >
              <img
                className="list-card__poster"
                src={
                  item.movie.poster_path
                    ? `https://image.tmdb.org/t/p/w342${item.movie.poster_path}`
                    : popcornFallback
                }
                alt={item.movie.original_title}
              />

              <h3 className="list-card__movie-title">
                {item.movie.original_title}
              </h3>
            </Link>

            <button
              type="button"
              className="list-card__remove"
              onClick={() => handleRemove(item.listItemId)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="list-card__footer">
        <div className="list-card__actions">
          {listItems.length > 0 ? (
            <Link to={`/lists/${list.id}`} state={{ list_name: list.name }}>
              <Button>View List</Button>
            </Link>
          ) : null}
          {!["FAVOURITES", "WATCHLIST"].includes(list.list_type) && (
            <>
              <Button onClick={() => setIsOpen(true)}>Edit</Button>
              <Button onClick={handleDeleteList}>Delete</Button>
            </>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <EditListForm
          listName={list.name}
          listId={list.id}
          visibility={list.visibility}
          setIsOpen={setIsOpen}
        />
      </Modal>
    </article>
  );
}
