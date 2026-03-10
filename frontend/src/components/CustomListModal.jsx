import { useEffect } from "react";
import "./CustomListModal.css";

export default function CustomListModal({
  listQuery,
  addMovieHandler,
  customListsWithMovieState,
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (listQuery.isLoading) {
    return (
      <div className="list-modal">
        <div className="list-modal-header">
          <h2>Lists</h2>
          <p>Choose a list to save this movie.</p>
        </div>
        <div className="list-modal-loading">Loading lists...</div>
      </div>
    );
  }

  if (listQuery.isError) {
    return (
      <div className="list-modal">
        <div className="list-modal-header">
          <h2>Lists</h2>
        </div>
        <p className="list-modal-error">{listQuery.error.message}</p>
      </div>
    );
  }

  return (
    <div className="search-modal-container">
      <div className="section-title">
        <h2>Lists</h2>
      </div>

      <div className="list-modal-body">
        {customListsWithMovieState.map((list) => (
          <button
            key={list.id}
            className="list-row"
            onClick={() => addMovieHandler(list.id, true)}
            disabled={list.hasMovie}
          >
            <div className="list-row-text">
              <span className="list-row-title">{list.name}</span>
            </div>
            {!list.hasMovie && <span className="list-row-arrow">+</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
