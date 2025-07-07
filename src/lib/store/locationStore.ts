// store/locationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LocationStore = {
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
};

export const useLocationStore = create(
  persist<LocationStore>(
    (set) => ({
      selectedLocation: '',
      setSelectedLocation: (value) => set({ selectedLocation: value }),
    }),
    {
      name: 'selected-location-storage', // localStorage key
    }
  )
);
