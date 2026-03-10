import { getTrendingMovies } from "../api/getTrendingMovies";
import "./TrendingSection.css";
import { useQuery } from "@tanstack/react-query";
import "./TrendingSection.css";
import Card from "../components/Card";

export default function TrendingSection() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: getTrendingMovies,
  });

  const results = data?.results ?? [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <section className="trending-section">
      <h2 className="section-title">Trending Movies</h2>

      <div className="trending-cards">
        {results.slice(0, 5).map((result) => (
          <Card
            key={result.id}
            id={result.id}
            poster_path={result.poster_path}
            title={result.title}
            overview={result.overview}
          />
        ))}
      </div>
    </section>
  );
}
