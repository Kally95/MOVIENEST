import { useState } from "react";
import "./HeroSection.css";
import { useDebounce } from "../hooks/useDebounce";
import { useMovieSearch } from "../hooks/useMovieSearch";
import { Link } from "react-router-dom";
import { SearchIcon } from "../components/SearchIcon";
import popcornFallback from "../assets/popcorn.jpg";

export default function HeroSection() {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(input, 400);
  const canSearch = debouncedQuery.trim().length >= 2;
  const { isPending, isError, results, error } = useMovieSearch(debouncedQuery);

  function handleOnChange(e) {
    setInput(e.target.value);

    if (!isOpen) {
      setIsOpen(true);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <section className="section-hero">
      <div className="hero-inner">
        <h1>Welcome.</h1>
        <p>Millions of movies and TV shows. Explore now.</p>

        <form className="hero-searchForm" onSubmit={handleSubmit}>
          <div className="hero-searchWrap">
            <input
              type="text"
              className="hero-search"
              placeholder="Search for a movie..."
              aria-label="Search for a movie"
              value={input}
              onChange={handleOnChange}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
            />

            <button
              type="submit"
              className="hero-searchBtn"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            {isOpen && canSearch && (
              <div className="hero-dropdown" role="listbox">
                {isPending && (
                  <div className="hero-dropdown-pending">Searching…</div>
                )}

                {isError && <div className="hero-dropdown-error">{error}</div>}

                {!isPending && !isError && results.length === 0 && (
                  <div className="hero-dropdown-empty">
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
                        <SearchIcon />
                        <span className="hero-dropdown-title">
                          {result.title}
                        </span>
                        {posterUrl && (
                          <div className="poster-wrapper">
                            <img
                              className="hero-dropdown-poster"
                              src={posterUrl}
                            />
                          </div>
                        )}
                        {year && (
                          <span className="hero-dropdown-year">({year})</span>
                        )}
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
