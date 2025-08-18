// stores/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Updated interface to match the new format
interface CartItem {
  itemId: number | undefined;
  itemName: string | undefined;
  itemImage: string | undefined;
  itemPrice: number;
  itemBasePrice: number;
  itemQuantity: number;
  itemVariations: { [key: string]: string }; // New format: object
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

// Helper function to compare variations objects
const areVariationsEqual = (
  variations1: { [key: string]: string } | undefined,
  variations2: { [key: string]: string } | undefined
): boolean => {
  // Handle undefined cases
  if (!variations1 && !variations2) return true;
  if (!variations1 || !variations2) return false;

  const keys1 = Object.keys(variations1);
  const keys2 = Object.keys(variations2);

  // Check if they have the same number of keys
  if (keys1.length !== keys2.length) return false;

  // Check if all keys and values match
  return keys1.every((key) => variations1[key] === variations2[key]);
};

export const useCartStore = create(
  persist<CartState>(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          // Find existing item with same ID, variations, and instructions
          const existingIndex = state.items.findIndex(
            (existingItem) =>
              existingItem.itemId === item.itemId &&
              areVariationsEqual(
                existingItem.itemVariations,
                item.itemVariations
              ) &&
              existingItem.itemInstructions === item.itemInstructions
          );

          // If exact match found, increase quantity
          if (existingIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              itemQuantity:
                (updatedItems[existingIndex].itemQuantity ?? 0) +
                (item.itemQuantity ?? 0),
              // Update the price in case base price changed
              itemPrice:
                updatedItems[existingIndex].itemBasePrice *
                ((updatedItems[existingIndex].itemQuantity ?? 0) +
                  (item.itemQuantity ?? 0)),
            };
            return { items: updatedItems };
          }

          // If no exact match, add as new item
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
            i === index
              ? {
                  ...item,
                  itemQuantity: newQuantity,
                  // Update total price based on new quantity
                  itemPrice: item.itemBasePrice * newQuantity,
                }
              : item
          );

          return { items: updatedItems };
        }),
      clearCart: () => set({ items: [] }),
      toggleCart: (state) =>
        set((s) => ({ isOpen: state !== undefined ? state : !s.isOpen })),
    }),
    {
      name: "cart-storage",
      // Migration function to handle old cart data
      migrate: (persistedState: any, version: number) => {
        // Clear old cart data that might have incompatible format
        if (version === 0 || !persistedState) {
          return {
            items: [],
            isOpen: false,
          };
        }

        // Handle items that might have old itemVariation format
        if (persistedState.items) {
          persistedState.items = persistedState.items.map((item: any) => {
            // If item has old itemVariation (array), convert to new format or clear
            if (item.itemVariation && Array.isArray(item.itemVariation)) {
              // Convert old array format to new object format
              const variations: { [key: string]: string } = {};
              item.itemVariation.forEach((variation: any) => {
                if (variation.type && variation.name) {
                  variations[variation.type] = variation.name;
                }
              });

              return {
                ...item,
                itemVariations: variations,
                itemVariation: undefined, // Remove old property
              };
            }

            // Ensure itemVariations exists
            if (!item.itemVariations) {
              item.itemVariations = {};
            }

            return item;
          });
        }

        return persistedState;
      },
      version: 1, // Increment version to trigger migration
    }
  )
);
