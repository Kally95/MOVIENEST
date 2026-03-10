import "./PopularSection.css";
import { useQuery } from "@tanstack/react-query";
import { getPopularMovies } from "../api/getPopularMovies";
import Carousel from "../components/Carousel";

export default function PopularSection() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: getPopularMovies,
  });

  const results = data?.results || [];

  return (
    <section className="popular-movies-section">
      <h1 className="section-title">Popular Movies</h1>
      <Carousel movies={results?.slice(0, 4)} />
    </section>
  );
}
