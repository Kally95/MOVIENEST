import "./SearchModal.css";
import { useDebounce } from "../hooks/useDebounce";
import { useMovieSearch } from "../hooks/useMovieSearch";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import popcornFallback from "../assets/popcorn.jpg";

export default function SearchModal({ setIsOpen }) {
  const [input, setInput] = useState("");

  const debouncedQuery = useDebounce(input, 250);

  const { isPending, isError, results, error } = useMovieSearch(debouncedQuery);

  const validQuerylength = debouncedQuery.length > 2;

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <section className="search-modal-container">
      <div className="search-modal-wrapper">
        <h1 className="section-title modal-title">Search A Movie</h1>
        <input className="search-modal-input" onChange={handleInputChange} />

        <div className="modal-dropdown-results" role="listbox">
          {isPending && validQuerylength && (
            <div className="modal-dropdown-pending">Searching…</div>
          )}
          {isError && error && validQuerylength && (
            <div className="hero-dropdown-error">{String(error)}</div>
          )}
          {!isPending && !isError && results.length === 0 && (
            <div className="modal-dropdown-empty">
              No results for “{debouncedQuery}”
            </div>
          )}
          {!isPending &&
            !isError &&
            results.slice(0, 8).map((result) => {
              const year = result.release_date?.slice(0, 4);
              const posterUrl = result?.poster_path
                ? `https://image.tmdb.org/t/p/original${result.poster_path}`
                : popcornFallback;

              return (
                <Link
                  key={result.id}
                  to={`/movie/${result.id}`}
                  className="hero-dropdown-item"
                  role="option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="hero-dropdown-title">{result.title}</span>
                  {posterUrl && (
                    <div className="poster-wrapper">
                      <img className="hero-dropdown-poster" src={posterUrl} />
                    </div>
                  )}
                  {year && <span className="hero-dropdown-year">({year})</span>}
                </Link>
              );
            })}
        </div>
      </div>
    </section>
  );
}
