import { useQuery } from "@tanstack/react-query";
import { getMovieByName } from "../api/getMovieByName";

export function useMovieSearch(query) {
  const cleanQuery = (query ?? "").trim();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["movieSearch", cleanQuery],
    queryFn: () => getMovieByName(cleanQuery),
    enabled: cleanQuery.length >= 2,
  });

  return { isPending, isError, results: data?.results ?? [], error };
}
