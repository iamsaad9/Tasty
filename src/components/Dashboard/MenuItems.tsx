import { Card } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { FaWineGlassAlt, FaIceCream, FaDrumstickBite } from "react-icons/fa";
import { motion } from "framer-motion";
import FadeInSection from "../ui/scrollAnimated";
import { Link } from "@heroui/react";
import Heading from "../Heading";
import { DashboardMenuItemCard } from "../MenuItemCard";
import { useLocationStore } from "@/lib/store/locationStore";

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
  itemVariation: [{ type: string; name: string; price_multiplier: number }];
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

interface MenuItemProps {
  showLoading: (val: boolean) => void;
}

function MenuItems({ showLoading }: MenuItemProps) {
  const [activeMenu, setActiveMenu] = useState<string>("Main");
  const { selectedLocation } = useLocationStore();
  const menuType = [
    {
      id: 1,
      name: "Main",
      active: true,
      icon: <FaDrumstickBite className="text-2xl text-background" />,
    },
    {
      id: 2,
      name: "Dessert",
      active: false,
      icon: <FaIceCream className="text-2xl text-background" />,
    },
    {
      id: 3,
      name: "Drinks",
      active: false,
      icon: <FaWineGlassAlt className="text-2xl text-background" />,
    },
  ];

  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);

  const filterMenuItems = (data: MenuItems[]) => {
    console.log("Data in Filter Function: ", data);
    return data.filter((item) => {
      return (
        item.delivery.isDeliverable === true &&
        item.delivery.areas.some((area) => area.name === selectedLocation)
      );
    });
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      showLoading(true);
      const res = await fetch("/Data/menu.json");
      const data = await res.json();
      const filteredMenuItems = filterMenuItems(data);
      setMenuItems(filteredMenuItems);
      showLoading(false);
    };
    fetchMenuItems();
  }, [selectedLocation]);

  const handleMenuClick = (id: number) => {
    console.log("Menu clicked:", id);
    console.log(menuType[id - 1].name);
    setActiveMenu(menuType[id - 1].name);
  };
  return (
    <div className=" w-full lg:w-[90vw] xl:w-[80vw] flex flex-col gap-10 py-10 justify-center items-center px-5 lg:px-0">
      <Heading title="OUR MENU" subheading="Discover Our Exclusive Menu" />

      <div className="w-full sm:px-0 ">
        <FadeInSection
          delay={0.2}
          className="flex sm:flex-row justify-center flex-col gap-2 sm:gap-10 p-2 "
        >
          {menuType.map((item) => (
            <Card
              key={item.id}
              className={`${
                activeMenu == item.name
                  ? "bg-theme scale-105"
                  : "bg-foreground hover:bg-background/10"
              } rounded-sm cursor-pointer px-5`}
            >
              <div
                className="p-2 py-5 flex gap-2"
                onClick={() => handleMenuClick(item.id)}
              >
                {item.icon}
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
          .filter((item) => item.category.split(" ")[0] === activeMenu)
          .map((item) => (
            <motion.div
              key={`${activeMenu}-${item.id}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.8 }}
            >
              <FadeInSection className="w-full">
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
            </motion.div>
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
