import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LocationStore = {
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
};

export const useLocationStore = create(
  persist<LocationStore>(
    (set) => ({
      selectedLocation: '',
      setSelectedLocation: (value) => set({ selectedLocation: value }),
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: 'selected-location-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // mark hydration complete
      },
    }
  )
);
