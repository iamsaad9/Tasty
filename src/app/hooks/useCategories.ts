// hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import { Categories } from "@/types";

export function useCategories() {
  return useQuery({
    queryKey: ["Categories"],
    queryFn: async () => {
      console.log("Fetching Categories using API");
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch Categories");
      return res.json() as Promise<Categories[]>;
    },
    staleTime: 5 * 60 * 1000,
  });
}
