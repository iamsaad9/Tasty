// hooks/useOccasion.ts
import { useQuery } from "@tanstack/react-query";

interface OccasionType {
  id: number;
  key: string;
  label: string;
}

export function useOccasionType() {
  return useQuery({
    queryKey: ["OccasionType"],
    queryFn: async () => {
      console.log("Fetching OccasionType using API");
      const res = await fetch("/api/occasionType");
      if (!res.ok) throw new Error("Failed to fetch OccasionType");
      return res.json() as Promise<OccasionType[]>;
    },
    staleTime: 5 * 60 * 1000,
  });
}
