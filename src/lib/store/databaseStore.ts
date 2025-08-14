import { IMenuItem } from "@/../models/menuItems";
import { IMenuLink } from "@/../models/menuLinks";
import { ICategoryType } from "@/../models/categoryType";
import { ILocations } from "@/../models/locations";
import { IUser } from "@/../models/user";
import { create } from "zustand";

interface MenuLinkType {
  id: string;
  name: string;
  href: string;
  icon: string;
  order: number;
  roles: string[];
}
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
interface DietaryOption {
  id: number;
  label: string;
}

// export type {
//   IMenuItem,
//   IMenuLink,
//   ICategoryType,
//   ILocations,
//   IUser,
//   ItemVariation,
// };

interface DataState {
  menuItems: IMenuItem[];
  menuLinks: MenuLinkType[];
  categories: ICategoryType[];
  locations: ILocations[];
  users: IUser[];
  dietary: DietaryOption[];
  variation: ItemVariation[];

  setMenuItems: (items: IMenuItem[]) => void;
  setMenuLinks: (links: MenuLinkType[]) => void;
  setCategories: (categories: ICategoryType[]) => void;
  setLocations: (locations: ILocations[]) => void;
  setUsers: (users: IUser[]) => void;
  setVariation: (types: ItemVariation[]) => void;
  setDietary: (types: DietaryOption[]) => void;

  fetchMenuItems: () => Promise<void>;
  fetchMenuLinks: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchDietary: () => Promise<void>;
  fetchVariationTypes: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  menuItems: [],
  menuLinks: [],
  categories: [],
  locations: [],
  users: [],
  variation: [],
  dietary: [],

  setMenuItems: (items) => set({ menuItems: items }),
  setMenuLinks: (links) => set({ menuLinks: links }),
  setCategories: (categories) => set({ categories }),
  setLocations: (locations) => set({ locations }),
  setUsers: (users) => set({ users }),
  setDietary: (dietary) => set({ dietary }),
  setVariation: (types) => set({ variation: types }),

  fetchMenuItems: async () => {
    if (get().menuItems.length > 0) return; // ✅ Prevent duplicate API calls
    const res = await fetch("/api/menu-items");
    const data = await res.json();
    set({ menuItems: data });
  },
  fetchMenuLinks: async () => {
    if (get().menuLinks.length > 0) return;
    const res = await fetch("/api/menu-links");
    const data = await res.json();
    set({ menuLinks: data });
  },
  fetchCategories: async () => {
    if (get().categories.length > 0) return;
    const res = await fetch("/api/categories");
    const data = await res.json();
    set({ categories: data });
  },
  fetchLocations: async () => {
    if (get().locations.length > 0) return;
    const res = await fetch("/api/locations");
    const data = await res.json();
    set({ locations: data });
  },
  fetchUsers: async () => {
    if (get().users.length > 0) return;
    const res = await fetch("/api/users");
    const data = await res.json();
    set({ users: data });
  },
  fetchVariationTypes: async () => {
    if (get().variation.length > 0) return;
    const res = await fetch("/api/variation-types");
    const data = await res.json();
    set({ variation: data });
  },
  fetchDietary: async () => {
    if (get().dietary.length > 0) return;
    const res = await fetch("/api/dietaryPreference");
    const data = await res.json();
    set({ dietary: data });
  },
}));
