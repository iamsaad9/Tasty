// stores/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  itemId?: number;
  itemName?: string;
  itemImage?: string;
  itemBasePrice?: number;
  itemPrice?: number;
  itemQuantity?: number;
  itemVariation?: string;
  itemInstructions?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void; // index-based removal
  updateItemQuantity: (index: number, quantity: number) => void; // Add this method
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
          const existingIndex = state.items.findIndex(
            (i) =>
              i.itemId === item.itemId &&
              i.itemVariation === item.itemVariation &&
              i.itemInstructions === item.itemInstructions
          );

          if (existingIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              itemQuantity:
                (updatedItems[existingIndex].itemQuantity ?? 0) +
                (item.itemQuantity ?? 0),
            };
            return { items: updatedItems };
          }

          return { items: [...state.items, item] };
        }),
      removeItem: (index) =>
        set((state) => {
          const newItems = [...state.items];
          newItems.splice(index, 1);
          return { items: newItems };
        }),
      updateItemQuantity: (index, quantity) =>
        set((state) => {
          // Ensure quantity is at least 1
          const newQuantity = Math.max(1, quantity);

          const updatedItems = state.items.map((item, i) =>
            i === index ? { ...item, itemQuantity: newQuantity } : item
          );

          return { items: updatedItems };
        }),
      clearCart: () => set({ items: [] }),
      toggleCart: (state) =>
        set((s) => ({ isOpen: state !== undefined ? state : !s.isOpen })),
    }),
    {
      name: "cart-storage",
    }
  )
);
