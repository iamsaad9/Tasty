import { create } from "zustand";
import { persist } from "zustand/middleware";

type DeliveryMode = "delivery" | "pickup";

type LocationStore = {
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  deliveryMode: DeliveryMode;
  setDeliveryMode: (mode: DeliveryMode) => void;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
};

export const useLocationStore = create(
  persist<LocationStore>(
    (set) => ({
      selectedLocation: "",
      setSelectedLocation: (value) => set({ selectedLocation: value }),

      deliveryMode: "delivery",
      setDeliveryMode: (mode) => set({ deliveryMode: mode }),

      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: "selected-location-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // mark hydration complete
      },
    }
  )
);
