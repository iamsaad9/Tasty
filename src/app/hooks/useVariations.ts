// hooks/useVariations.ts
import { useQuery } from "@tanstack/react-query";

interface VariationType {
  id: string;
  label: string;
}

export function useVariations() {
  return useQuery({
    queryKey: ["Variations"],
    queryFn: async () => {
      console.log("Fetching Variations using API");
      const res = await fetch("/api/variationType");
      if (!res.ok) throw new Error("Failed to fetch Variations");
      return res.json() as Promise<VariationType[]>;
    },
    staleTime: 5 * 60 * 1000,
  });
}
