// hooks/useReservation.ts
import { useQuery } from "@tanstack/react-query";

interface Reservation {
  id: number;
  name: string;
  date: string;
  phone?: string;
  time: string;
  duration: number;
  guests: number;
  email: string;
  status: string;
  occasion: number;
  requests?: string;
  tableId?: string;
}

export function useReservations() {
  return useQuery({
    queryKey: ["Reservations"],
    queryFn: async () => {
      console.log("Fetching Reservations using API");
      const res = await fetch("/api/reservations");
      if (!res.ok) throw new Error("Failed to fetch Reservations");
      return res.json() as Promise<Reservation[]>;
    },
    staleTime: 5 * 60 * 1000,
  });
}
