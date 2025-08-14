// hooks/useMenuItems.ts
import { useQuery } from "@tanstack/react-query";

interface ItemVariation {
  type: string;
  name: string;
  price_multiplier: number;
}

interface DeliveryArea {
  area: string;
  postalCode: string;
  fee: number;
}

interface Delivery {
  isDeliverable: boolean;
  estimatedTime: string;
  baseFee: number;
  freeAbove: number;
  minOrder: number;
  areas: DeliveryArea[];
}

interface MenuItem {
  _id?: string;
  id: number;
  title: string;
  category: string;
  diet: string[];
  price: number;
  description: string;
  image: string;
  popularity: number;
  rating: number;
  special: boolean;
  itemVariation: ItemVariation[];
  delivery: Delivery;
}

export function useMenuItems() {
  return useQuery({
    queryKey: ["MenuItems"],
    queryFn: async () => {
      console.log("Fetching MenuItems using API");
      const res = await fetch("/api/menuItems");
      if (!res.ok) throw new Error("Failed to fetch MenuItems");
      return res.json() as Promise<MenuItem[]>;
    },
    staleTime: 10 * 60 * 1000,
  });
}
