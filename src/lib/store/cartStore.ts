// stores/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  itemId?: number;
  itemName?: string;
  itemImage?: string;
  itemPrice?: number;
  itemQuantity?: number;
  itemVariation?: string;
  itemInstructions?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: number | undefined) => void;
  clearCart: () => void;
  toggleCart: (state?: boolean) => void;
}

export const useCartStore = create(
  persist<CartState>(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          console.log(item);
          const existing = state.items.find((i) => i === item);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.itemId === item.itemId
                  ? {
                      ...i,
                      itemQuantity:
                        (i.itemQuantity ?? 0) + (item.itemQuantity ?? 0),
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.itemId !== id),
        })),
      clearCart: () => set({ items: [] }),
      toggleCart: (state) =>
        set((s) => ({ isOpen: state !== undefined ? state : !s.isOpen })),
    }),
    {
      name: "cart-storage",
    }
  )
);
