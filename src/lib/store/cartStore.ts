// stores/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Cart Item type
interface CartItem {
  itemId: number;
  itemName: string;
  itemImage: string;
  itemPrice: number;
  itemBasePrice: number;
  itemQuantity: number;
  itemVariations: Record<string, string>; // Object format
  itemInstructions: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (state?: boolean) => void;
}

// Old cart item format (before migration)
interface OldCartItem {
  itemId?: number;
  itemName?: string;
  itemImage?: string;
  itemPrice?: number;
  itemBasePrice?: number;
  itemQuantity?: number;
  itemVariation?: { type: string; name: string }[];
  itemVariations?: Record<string, string>;
  itemInstructions?: string;
}

// Migration state type
interface PersistedCartState {
  items?: (CartItem | OldCartItem)[];
  isOpen?: boolean;
}

// Helper function to compare variations
const areVariationsEqual = (
  v1: Record<string, string> | undefined,
  v2: Record<string, string> | undefined
): boolean => {
  if (!v1 && !v2) return true;
  if (!v1 || !v2) return false;

  const keys1 = Object.keys(v1);
  const keys2 = Object.keys(v2);
  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => v1[key] === v2[key]);
};

// Define what gets persisted
interface CartData {
  items: CartItem[];
  isOpen: boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get): CartState => ({
      items: [],
      isOpen: false,

      // actions
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (index) =>
        set((state) => {
          const newItems = [...state.items];
          newItems.splice(index, 1);
          return { items: newItems };
        }),
      updateItemQuantity: (index, quantity) =>
        set((state) => {
          const newItems = [...state.items];
          if (newItems[index]) newItems[index].itemQuantity = quantity;
          return { items: newItems };
        }),
      clearCart: () => set({ items: [] }),
      toggleCart: (state) =>
        set((s) => ({ isOpen: state !== undefined ? state : !s.isOpen })),
    }),
    {
      name: "cart-storage",
      version: 1,
      migrate: (persistedState, version): CartData => {
        const state = persistedState as PersistedCartState | undefined;

        if (version === 0 || !state) {
          return { items: [], isOpen: false };
        }

        const migratedItems: CartItem[] = (state.items ?? []).map((item) => {
          if ("itemVariation" in item && Array.isArray(item.itemVariation)) {
            const variations: Record<string, string> = {};
            item.itemVariation.forEach((variation) => {
              if (variation.type && variation.name) {
                variations[variation.type] = variation.name;
              }
            });

            return {
              itemId: item.itemId ?? 0,
              itemName: item.itemName ?? "",
              itemImage: item.itemImage ?? "",
              itemPrice: item.itemPrice ?? 0,
              itemBasePrice: item.itemBasePrice ?? 0,
              itemQuantity: item.itemQuantity ?? 1,
              itemVariations: variations,
              itemInstructions: item.itemInstructions ?? "",
            };
          }

          return {
            itemId: item.itemId ?? 0,
            itemName: item.itemName ?? "",
            itemImage: item.itemImage ?? "",
            itemPrice: item.itemPrice ?? 0,
            itemBasePrice: item.itemBasePrice ?? 0,
            itemQuantity: item.itemQuantity ?? 1,
            itemVariations: item.itemVariations ?? {},
            itemInstructions: item.itemInstructions ?? "",
          };
        });

        return {
          items: migratedItems,
          isOpen: state.isOpen ?? false,
        };
      },
    }
  )
);
