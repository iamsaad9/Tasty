"use client";
import { useState, useEffect, use } from "react";
import React, { JSX } from "react";
import FadeInSection from "@/components/ui/scrollAnimated";
import SpecialsCorousel from "@/components/Menu/SpecialsCorousel";
import MenuFilter from "@/components/Menu/MenuSearch";
import { Card } from "@/components/ui/card";
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
import MenuItemModal from "@/components/Modals/MenuItemModal";
import { MenuItemCard } from "@/components/MenuItemCard";
import { useMenuItemModalStore } from "@/lib/store/menuItemModalStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useCategories } from "@/app/hooks/useCategories";
import { MenuItem } from "@/types";
import { useMenuItems } from "@/app/hooks/useMenuItems";

function MenuPage() {
  const { data: session } = useSession();
  const { data: MenuItems, isPending } = useMenuItems();

  const iconMap: Record<string, JSX.Element> = {
    FaDrumstickBite: (
      <FaDrumstickBite className="xl:text-2xl lg:text-xl text-lg text-background" />
    ),
    FaBreadSlice: (
      <FaBreadSlice className="xl:text-2xl lg:text-xl text-lg text-background" />
    ),
    FaPizzaSlice: (
      <FaPizzaSlice className="xl:text-2xl lg:text-xl text-lg text-background" />
    ),
    FaIceCream: (
      <FaIceCream className="xl:text-2xl lg:text-xl text-lg text-background" />
    ),
    FaWineGlassAlt: (
      <FaWineGlassAlt className="xl:text-2xl lg:text-xl text-lg text-background" />
    ),
  };
  const { selectedLocation, hasHydrated, deliveryMode } = useLocationStore();
  const [searchText, setSearchText] = React.useState("");
  const [activeMenu, setActiveMenu] = React.useState("1");
  const [filters, setFilters] = React.useState({
    selectedDiet: ["all"],
    priceRange: [0, 100],
    selectedSort: "default",
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [itemToCard, setItemToCart] = useState<number | null>();
  const [showItemModal, setShowItemModal] = useState(false);
  const [menuItemClicked, setMenuItemClicker] = useState<number>();
  const openModal = useMenuItemModalStore((state) => state.openModal);
  const searchParams = useSearchParams();
  const { data: Categories } = useCategories();

  const filterMenuItems = (data: MenuItem[]) => {
    if (deliveryMode !== "delivery") return data;

    return data.filter((item) => {
      return (
        item.delivery.isDeliverable === true &&
        item.delivery.areas.some((area) => area.area === selectedLocation)
      );
    });
  };

  useEffect(() => {
    if (!isPending && MenuItems) {
      console.log("MenuItems", MenuItems);
      const filteredMenuItems = filterMenuItems(MenuItems);
      setMenuItems(filteredMenuItems);
    }
  }, [isPending, MenuItems]);

  useEffect(() => {
    const itemId = searchParams.get("item");
    if (itemId) {
      const item = menuItems.find((i) => i.id === Number(itemId));
      const MenuItem = {
        id: item?.id,
        name: item?.title,
        price: item?.price,
        image: item?.image,
        description: item?.description,
        itemVariation: item?.itemVariation,
        is_deliverable: item?.delivery.isDeliverable,
        delivery_locations: item?.delivery.areas,
      };
      const path = "/menu";
      openModal(MenuItem, path);
    }
  }, [searchParams, menuItems]);

  useEffect(() => {
    if (hasHydrated && deliveryMode === "delivery" && selectedLocation === "") {
      setShowAddressModal(true);
    }
  }, [hasHydrated, selectedLocation, deliveryMode]);

  const handleApplySearch = (searchText: { searchText: string }) => {
    setSearchText(searchText.searchText);
  };

  const handleMenuClick = (id: string) => {
    setActiveMenu(id);
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
  };

  const handleResetFilters = () => {
    setFilters({
      selectedDiet: ["all"],
      priceRange: [0, 100],
      selectedSort: "default",
    });
  };

  const handleAddtoCart = (itemId: number) => {
    if (!session) {
      setShowLogin(true);
      return null;
    }
    setItemToCart(itemId);
  };

  return (
    <div className="w-full">
      <MenuItemModal />
      <LocationModal
        isOpen={showAddressModal}
        title="Select Your Location"
        description="Please select your location"
        onClose={() => setShowAddressModal(false)}
      />
      <LoadingScreen showLoading={loading} />
      {/* Background Section */}
      <PageBanner
        title="Discover Our Exclusive Menu"
        image="/images/PageBanners/menuPage.jpg"
      />
      <SpecialsCorousel
        addItemToCart={(itemId: number) => handleAddtoCart(itemId)}
        menuItems={MenuItems}
      />

      <MenuFilter
        onApplySearch={handleApplySearch}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <div className="w-full flex flex-col items-center justify-center  gap-5 p-2 md:p-5">
        <div className="lg:w-[90%] w-full sm:px-2 py-5">
          <FadeInSection className="w-full flex md:flex-row justify-center flex-col gap-3 sm:gap-5 xl:gap-10 p-2 ">
            {Categories?.map((item) => (
              <Card
                key={item.id}
                className={`${
                  activeMenu === item.id
                    ? "bg-theme scale-105"
                    : "bg-foreground hover:bg-background/10"
                } rounded-sm cursor-pointer xl:px-5 px-2 transition duration-300`}
              >
                <div
                  className="p-2 py-5 flex gap-2"
                  onClick={() => handleMenuClick(item.id)}
                >
                  {iconMap[item.icon as keyof typeof iconMap] ?? null}
                  <h2 className="xl:text-lg lg:text-md text-sm font-semibold text-accent">
                    {item.name}
                  </h2>
                </div>
              </Card>
            ))}
          </FadeInSection>
        </div>

        <FadeInSection className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-5">
          <AnimatePresence>
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
                    return 0;
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
                    itemVariation={item.itemVariation}
                    is_deliverable={item.delivery.isDeliverable}
                    delivery_locations={item.delivery.areas}
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
