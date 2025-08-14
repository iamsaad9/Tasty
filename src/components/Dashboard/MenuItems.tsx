import { Card } from "@heroui/react";
import React, { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import FadeInSection from "../ui/scrollAnimated";
import { Link } from "@heroui/react";
import Heading from "../Heading";
import { DashboardMenuItemCard } from "../MenuItemCard";
import { useLocationStore } from "@/lib/store/locationStore";
import { useCategories } from "@/app/hooks/useCategories";
import {
  FaDrumstickBite,
  FaIceCream,
  FaWineGlassAlt,
  FaPizzaSlice,
  FaBreadSlice,
} from "react-icons/fa";
import { useMenuItems } from "@/app/hooks/useMenuItems";
import { MenuItem, Categories } from "@/types";

interface MenuItemProps {
  showLoading: (val: boolean) => void;
}

function MenuItems({ showLoading }: MenuItemProps) {
  const [activeMenu, setActiveMenu] = useState<string>("1");
  const { selectedLocation, deliveryMode } = useLocationStore();

  const [filteredCategories, setFilteredCategories] = useState<Categories[]>(
    []
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const { data: Categories, isLoading } = useCategories();
  const { data: MenuItems, isPending } = useMenuItems();

  const filterCategories = (categories: Categories[]) => {
    return categories.slice(0, 3);
  };

  useEffect(() => {
    if (!isLoading && Categories) {
      const filteredCategories = filterCategories(Categories);
      setFilteredCategories(filteredCategories);
    } else {
      console.log("No Category found");
    }
  }, [Categories]);

  const filterMenuItems = (data: MenuItem[]) => {
    if (deliveryMode !== "delivery") return data;

    return data.filter((item) => {
      return (
        item.delivery.isDeliverable === true &&
        item.delivery.areas.some((area) => area.area === selectedLocation)
      );
    });
  };

  // useEffect(() => {
  //   const fetchMenuItems = async () => {
  //     showLoading(true);
  //     const res = await fetch("/Data/menu.json");
  //     const data = await res.json();
  //     const filteredMenuItems = filterMenuItems(data);
  //     setMenuItems(filteredMenuItems);

  //     showLoading(false);
  //   };
  //   fetchMenuItems();
  // }, [selectedLocation, deliveryMode]);

  const handleMenuClick = (id: number) => {
    setActiveMenu(filteredCategories[id - 1].id);
  };

  useEffect(() => {
    if (!isPending && MenuItems) {
      const filteredMenuItems = filterMenuItems(MenuItems);
      setMenuItems(filteredMenuItems);
    }
  }, [isPending, MenuItems, deliveryMode]);

  const iconMap: Record<string, JSX.Element> = {
    FaDrumstickBite: (
      <FaDrumstickBite className="xl:text-2xl lg:text-xl text-lg text-background" />
    ),
    FaPizzaSlice: (
      <FaPizzaSlice className="xl:text-2xl lg:text-xl text-lg text-background" />
    ),
    FaIceCream: (
      <FaIceCream className="xl:text-2xl lg:text-xl text-lg text-background" />
    ),
  };

  return (
    <div className=" w-full lg:w-[90vw] xl:w-[80vw] flex flex-col gap-10 py-10 justify-center items-center px-5 lg:px-0">
      <Heading title="OUR MENU" subheading="Discover Our Exclusive Menu" />

      <div className="w-full sm:px-0 ">
        <FadeInSection
          delay={0.2}
          className="flex sm:flex-row justify-center flex-col gap-2 sm:gap-10 p-2 "
        >
          {filteredCategories?.map((item) => (
            <Card
              key={item.id}
              className={`${
                activeMenu == item.id
                  ? "bg-theme scale-105"
                  : "bg-foreground hover:bg-background/10"
              } rounded-sm cursor-pointer px-5`}
            >
              <div
                className="p-2 py-5 flex gap-2"
                onClick={() => handleMenuClick(parseInt(item.id))}
              >
                {iconMap[item.icon as keyof typeof iconMap] ?? null}
                <h2 className="text-lg font-semibold text-accent">
                  {item.name}
                </h2>
              </div>
            </Card>
          ))}
        </FadeInSection>
      </div>

      <div className="w-full grid gap-5 md:grid-cols-2">
        {menuItems
          .filter((item) => item.category === activeMenu)
          .map((item) => (
            <FadeInSection className="w-full" key={item.id}>
              <DashboardMenuItemCard
                itemId={item.id}
                itemName={item.title}
                itemDescription={item.description}
                itemPrice={item.price}
                itemVariation={item.itemVariation}
                itemImage={item.image}
                is_deliverable={item.delivery.isDeliverable}
                delivery_locations={item.delivery.areas}
              />
            </FadeInSection>
          ))}
      </div>

      <FadeInSection>
        <Link
          href="/menu"
          className="bg-transparent border-2 rounded-none border-secondary text-secondary px-2 md:px-10 py-3 text-sm md:text-xl cursor-pointer hover:bg-secondary hover:text-foreground transition-colors duration-300"
        >
          SEE MORE
        </Link>
      </FadeInSection>
    </div>
  );
}

export default MenuItems;
