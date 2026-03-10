import "./Card.css";
import { Link } from "react-router-dom";

export default function Card({ id, poster_path, title, overview }) {
  const imageUrl = `https://image.tmdb.org/t/p/w500${poster_path}`;
  return (
    <div className="card">
      <div className="poster">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="details">
        <h1 className="card-title">{title}</h1>
      </div>
      <div className="info">
        <p>{overview}</p>
        <Link to={`/movie/${id}`} className="read-more">
          Read more
        </Link>
      </div>
    </div>
  );
}
