// hooks/useTables.ts
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/types";

export function useTables() {
  return useQuery({
    queryKey: ["Tables"],
    queryFn: async () => {
      const res = await fetch("/api/tables");
      if (!res.ok) throw new Error("Failed to fetch Tables");
      return res.json() as Promise<Tables[]>;
    },
    staleTime: 5 * 60 * 1000,
  });
}
