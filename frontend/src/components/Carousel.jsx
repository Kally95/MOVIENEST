import "./Carousel.css";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

export default function Carousel({ movies }) {
  const safeMovies = useMemo(() => movies ?? [], [movies]);
  const [index, setIndex] = useState(0);

  const total = safeMovies.length;
  const movie = safeMovies[index];

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);
  const goTo = (i) => setIndex(i);

  if (!total) return null;

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  return (
    <div className="carousel" aria-roledescription="carousel">
      <img className="carousel-poster" src={imageUrl} alt={movie.title} />

      <div className="carousel-details">
        <h3 className="carousel-title">{movie.title}</h3>
        <p className="carousel-overview">{movie.overview}</p>

        <Link to={`/movie/${movie.id}`} className="carousel-read-more">
          Read more
        </Link>
      </div>

      <button
        type="button"
        className="carousel-btn carousel-btn-left"
        onClick={goPrev}
        aria-label="Previous movie"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="chevron-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        type="button"
        className="carousel-btn carousel-btn-right"
        onClick={goNext}
        aria-label="Next movie"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="chevron-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <div className="carousel-dots" role="tablist" aria-label="Choose slide">
        {safeMovies.map((m, i) => (
          <button
            key={m.id}
            type="button"
            className={`dot ${i === index ? "dot-fill" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
