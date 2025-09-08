// hooks/useDietaries.ts
import { useQuery } from "@tanstack/react-query";

interface DietaryOption {
  id: number;
  label: string;
}

export function useDietaries() {
  return useQuery({
    queryKey: ["Dietaries"],
    queryFn: async () => {
      const res = await fetch("/api/dietaryPreference");
      if (!res.ok) throw new Error("Failed to fetch Dietaries");
      return res.json() as Promise<DietaryOption[]>;
    },
    staleTime: 5 * 60 * 1000,
  });
}
