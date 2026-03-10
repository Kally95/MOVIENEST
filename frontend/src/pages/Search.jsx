import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  return (
    <div>
      <h1>Search Page</h1>
      <p>Query from URL: {query}</p>
    </div>
  );
}
