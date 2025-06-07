// src/lib/iconUtils.ts
import {
  Home,
  LayoutDashboard,
  ClipboardList,
  User,
  Settings,
  Shield,
  ShoppingCart,
  Package,
  Users as UsersIcon, // Renamed to avoid conflict
  TrendingUp,
  DollarSign,
  UserPlus,
  HelpCircle,
  Icon as LucideIcon,
} from "lucide-react";
import React from "react";

// This constant maps string names (as you might store them in your database)
// to the actual Lucide icon components.
export const iconMap: { [key: string]: typeof LucideIcon } = {
  HomeIcon: Home,
  LayoutDashboardIcon: LayoutDashboard,
  ClipboardListIcon: ClipboardList,
  UserIcon: User, // Note: 'User' from lucide-react is typically the person icon
  SettingsIcon: Settings,
  ShieldIcon: Shield,
  ShoppingCartIcon: ShoppingCart,
  PackageIcon: Package,
  UsersIcon: UsersIcon, // This is the 'Users' group icon from lucide-react
  TrendingUpIcon: TrendingUp,
  DollarSignIcon: DollarSign,
  UserPlusIcon: UserPlus,
  // Add any other icons you use in your menu_item or menu_tab seed data here
  // Ensure the keys here (e.g., "HomeIcon") exactly match what's in your database.
};

// This function takes an icon name (string) and returns the corresponding React icon component.
// It includes a fallback icon if the provided name isn't found in the map.
export const getIcon = (
  iconName?: string | null,
  className: string = "h-4 w-4 mr-2" // Default styling for the icon
): React.ReactElement => {
  if (iconName && iconMap[iconName]) {
    const IconComponent = iconMap[iconName];
    // @ts-expect-error: iconNode is provided internally by Lucide icons when used directly, but TS expects it here
    return <IconComponent className={className} />;
  }
  // Fallback icon if no match or iconName is null/undefined
  return <HelpCircle className={className} />;
};