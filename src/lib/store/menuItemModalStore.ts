// stores/menuItemModalStore.ts
import { create } from "zustand";

interface Variations {
  type: string;
  name: string;
  price_multiplier: number;
}

interface DeliveryAreas {
  name: string;
  postalCode: string;
  fee: number;
}

interface MenuItem {
  id: number | undefined;
  name: string | undefined;
  price: number | undefined;
  image: string | undefined;
  description: string | undefined;
  itemVariation: Variations[] | undefined;
  is_deliverable: boolean | undefined;
  delivery_locations: DeliveryAreas[] | undefined;
}

interface MenuItemModalStore {
  selectedItem: MenuItem | null;
  isOpen: boolean;
  previousPath: string | null;
  openModal: (item: MenuItem, fromPath: string) => void;
  closeModal: () => void;
}

export const useMenuItemModalStore = create<MenuItemModalStore>((set) => ({
  selectedItem: null,
  isOpen: false,
  previousPath: null,
  openModal: (item, fromPath) =>
    set({
      selectedItem: item,
      isOpen: true,
      previousPath: fromPath,
    }),
  closeModal: () =>
    set({
      selectedItem: null,
      isOpen: false,
      previousPath: null,
    }),
}));
