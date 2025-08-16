// hooks/useLocations.ts
import { useQuery } from "@tanstack/react-query";

interface Location {
  area: string;
  postalCode: string;
}

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      console.log("Fetching Location using API");
      const res = await fetch("/api/locations");
      if (!res.ok) throw new Error("Failed to fetch locations");
      return res.json() as Promise<Location[]>;
    },
    staleTime: 5 * 60 * 1000,
  });
}
