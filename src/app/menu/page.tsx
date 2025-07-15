"use client";
import { useState, useEffect } from "react";
import React from "react";
import FadeInSection from "@/components/ui/scrollAnimated";
import SpecialsCorousel from "@/components/Menu/SpecialsCorousel";
import MenuFilter from "@/components/Menu/MenuSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import {
  FaDrumstickBite,
  FaIceCream,
  FaWineGlassAlt,
  FaPizzaSlice,
  FaBreadSlice,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PageBanner from "@/components/PageBanner";
import ImageGallery from "@/components/ImageGallery";
import { useLocationStore } from "@/lib/store/locationStore";
import LoadingScreen from "@/components/Loading";
import LocationModal from "@/components/Modals/LocationModal";
import LoginModal from "@/components/Modals/LoginModal";
import MenuItemModal from "@/components/Modals/MenuItemModal";
import MenuItemCard from "@/components/MenuItemCard";
import { usePathname } from "next/navigation";
import { useSelectedLayoutSegments } from "next/navigation";
import { useMenuItemModalStore } from "@/lib/store/menuItemModalStore";
import { useSearchParams, useRouter } from 'next/navigation';

interface MenuItems {
  id: number;
  title: string;
  category: string;
  diet: string[];
  price: number;
  description: string;
  image: string;
  popularity: number;
  rating: number;
  special: boolean;
  variations:[
    {type:string,
      name:string,
      price_multiplier:number
    }
  ]
  delivery: {
    isDeliverable: boolean;
    estimatedTime: string;
    baseFee: number;
    freeAbove: number;
    minOrder: number;
    areas: [
      {
        name: string;
        postalCode: string;
        fee: number;
      }
    ];
  };
}

function MenuPage() {
  const { data: session } = useSession();
  const menuType = [
    {
      id: 1,
      name: "Main Course",
      active: true,
      icon: (
        <FaDrumstickBite className="xl:text-2xl lg:text-xl text-lg text-background" />
      ),
    },
    {
      id: 2,
      name: "Appetizer",
      active: false,
      icon: (
        <FaBreadSlice className="xl:text-2xl lg:text-xl text-lg text-background" />
      ),
    },
    {
      id: 3,
      name: "Fast Food",
      active: false,
      icon: (
        <FaPizzaSlice className="xl:text-2xl lg:text-xl text-lg text-background" />
      ),
    },
    {
      id: 4,
      name: "Dessert",
      active: false,
      icon: (
        <FaIceCream className="xl:text-2xl lg:text-xl text-lg text-background" />
      ),
    },
    {
      id: 5,
      name: "Drinks",
      active: false,
      icon: (
        <FaWineGlassAlt className="xl:text-2xl lg:text-xl text-lg text-background" />
      ),
    },
  ];
  const { selectedLocation, hasHydrated } = useLocationStore();
  const [searchText, setSearchText] = React.useState("");
  const [activeMenu, setActiveMenu] = React.useState("Main Course");
  const [filters, setFilters] = React.useState({
    selectedDiet: ["all"],
    priceRange: [0, 100],
    selectedSort: "default",
  });
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [itemToCard, setItemToCart] = useState<number | null>();
  const [showItemModal, setShowItemModal] = useState(false);
  const [menuItemClicked, setMenuItemClicker] = useState<number>();
  const segments = useSelectedLayoutSegments(); // e.g. ['item', 'cheeseburger']
  const isItemModal = segments[0] === "item";
  const itemName = segments[1]; // 'cheeseburger'
  const openModal = useMenuItemModalStore((state) => state.openModal);
  const pathname = usePathname();
  const searchParams = useSearchParams()
 
  useEffect(() => {
  const itemId = searchParams.get('item');
  if (itemId) {
    const item = menuItems.find(i => i.id === Number(itemId));
    const MenuItem = {
    id: item?.id,
    name: item?.title,
    price: item?.price,
    image: item?.image,
    description: item?.description,
    itemVariation:item?.variations
  };
  const path = '/menu'
   openModal(MenuItem,path);
  }
}, [searchParams, menuItems]);


  useEffect(() => {
    if (hasHydrated && selectedLocation === "") {
      setShowAddressModal(true);
    }
  }, [hasHydrated, selectedLocation]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      const res = await fetch("/Data/menu.json");
      const data = await res.json();
      setMenuItems(data);
      console.log("Menu items fetched:", data);
      setLoading(false);
    };
    
    fetchMenuItems();
  }, []);

  const handleApplySearch = (searchText: { searchText: string }) => {
    console.log("Search applied:", searchText);
    setSearchText(searchText.searchText);
  };

  const handleMenuClick = (name: string) => {
    console.log("Menu clicked:", name);
    setActiveMenu(name);
  };

  const handleApplyFilters = (filters: {
    selectedDiet: string[];
    priceRange: number[];
    selectedSort: string;
  }) => {
    setFilters((prev) => ({
      ...prev,
      selectedDiet:
        filters.selectedDiet.length === 0 ? ["all"] : filters.selectedDiet,
      priceRange: filters.priceRange,
      selectedSort: filters.selectedSort || "default",
    }));
    console.log("Applying filters:", filters);
  };

  const handleResetFilters = () => {
    setFilters({
      selectedDiet: ["all"],
      priceRange: [0, 100],
      selectedSort: "default",
    });
    console.log("Filters reset");
  };

  const handleAddtoCart = (itemId: number) => {
    if (!session) {
      setShowLogin(true);
      return null;
    }
    setItemToCart(itemId);
    console.log("Add item", itemId, " to cart");
  };

  const handleMenuItemClick = (itemId: number) => {
    setMenuItemClicker(itemId);
    setShowItemModal(true);
  };

  return (
    <div className="w-full">
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <MenuItemModal></MenuItemModal>
      <LocationModal
        isOpen={showAddressModal}
        title="Select Your Location"
        description="Please select your location"
      />
      <LoadingScreen showLoading={loading} />
      {/* Background Section */}
      <PageBanner
        title="Discover Our Exclusive Menu"
        image="/images/PageBanners/menuPage.jpg"
      />
      <SpecialsCorousel
        addItemToCart={(itemId: number) => handleAddtoCart(itemId)}
      />

      <MenuFilter
        onApplySearch={handleApplySearch}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <div className="w-full flex flex-col items-center justify-center  gap-5 p-2 md:p-5">
        <div className="lg:w-[90%] w-full sm:px-2 py-5">
          <FadeInSection className="w-full flex md:flex-row justify-center flex-col gap-3 sm:gap-5 xl:gap-10 p-2 ">
            {menuType.map((item) => (
              <Card
                key={item.id}
                className={`${
                  activeMenu == item.name
                    ? "bg-theme scale-105"
                    : "bg-foreground hover:bg-background/10"
                } rounded-sm  cursor-pointer xl:px-5 px-2 transition duration-300`}
              >
                <div
                  className="p-2 py-5 flex gap-2"
                  onClick={() => handleMenuClick(item.name)}
                >
                  {item.icon}
                  <h2 className="xl:text-lg lg:text-md text-sm font-semibold text-accent">
                    {item.name}
                  </h2>
                </div>
              </Card>
            ))}
          </FadeInSection>
        </div>

        <FadeInSection className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-5">
          <AnimatePresence mode="wait">
            {menuItems
              .filter(
                (item) =>
                  item.category === activeMenu &&
                  (searchText.trim() === "" ||
                    item.title
                      .toLowerCase()
                      .includes(searchText.toLowerCase())) &&
                  filters.selectedDiet.some((diet) =>
                    item.diet.includes(diet)
                  ) &&
                  item.price >= filters.priceRange[0] &&
                  item.price <= filters.priceRange[1]
              )
              .sort((a, b) => {
                switch (filters.selectedSort) {
                  case "price-asc":
                    return a.price - b.price;
                  case "price-desc":
                    return b.price - a.price;
                  case "popularity":
                    return b.popularity - a.popularity;
                  case "rating":
                    return b.rating - a.rating;
                  default:
                    return 0; // No sorting applied
                }
              })
              .map((item) => (
                <motion.div
                  key={`${activeMenu}-${item.id}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full"
                >
                  <MenuItemCard
                    itemId={item.id}
                    itemName={item.title}
                    itemDescription={item.description}
                    itemImage={item.image}
                    itemPrice={item.price}
                    itemVariation={item.variations}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </FadeInSection>
      </div>

      <ImageGallery />
    </div>
  );
}

export default MenuPage;
