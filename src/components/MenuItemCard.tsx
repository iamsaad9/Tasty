"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@heroui/react";
import { CardContent } from "./ui/card";
import { useMenuItemModalStore } from "@/lib/store/menuItemModalStore";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import LoginModal from "./Modals/LoginModal";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface Variations {
  type: string;
  name: string;
  price_multiplier: number;
}

interface DeliveryAreas {
  area: string;
  postalCode: string;
  fee: number;
}

interface MenuItemCardProps {
  itemId: number;
  itemName: string;
  itemImage: string;
  itemDescription: string;
  itemPrice: number;
  itemVariation?: Variations[];
  is_deliverable: boolean;
  delivery_locations: DeliveryAreas[];
}

export function MenuItemCard({
  itemId,
  itemName,
  itemImage,
  itemDescription,
  itemPrice,
  itemVariation,
  is_deliverable,
  delivery_locations,
}: MenuItemCardProps) {
  const { openModal } = useMenuItemModalStore();
  const session = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const MenuItem = {
    id: itemId,
    name: itemName,
    price: itemPrice,
    image: itemImage,
    description: itemDescription,
    itemVariation: itemVariation,
    is_deliverable: is_deliverable,
    delivery_locations: delivery_locations,
  };

  const router = useRouter();

  const handleClick = () => {
    if (!session.data) {
      setShowLoginModal(true);
      return null;
    }
    const currentPath = window.location.pathname + window.location.search;
    openModal(MenuItem, currentPath); // Save previous location

    const params = new URLSearchParams(window.location.search);
    params.set("item", MenuItem.id.toString());
    router.push(`/menu?${params.toString()}`, { scroll: false });
  };

  return (
    <motion.div
      key={MenuItem.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      whileTap={{ scale: 0.9 }}
    >
      <Card className="h-full rounded-2xl  md:max-w-xs overflow-hidden transition-shadow duration-300 group cursor-pointer">
        {showLoginModal && (
          <LoginModal
            open={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
        )}
        <CardContent
          className="h-full flex flex-col justify-between"
          onClick={handleClick}
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={`${itemImage}`}
              alt={`Special ${itemId}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex-1 p-2 md:p-4 flex flex-col justify-between  gap-2 ">
            <h3 className="text-md md:text-lg text-center font-semibold text-accent">
              {itemName}
            </h3>
            <p className="text-xs text-secondary hidden sm:flex">
              {itemDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between md:mt-2 gap-2 md:gap-0">
              <span className="text-theme font-bold text-lg">
                {itemPrice.toFixed(2)}$
              </span>
              <div className="flex gap-2 items-center">
                <Button
                  className="bg-theme text-white text-sm px-3 py-1 rounded-full hover:bg-theme-dark transition"
                  onPress={handleClick}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardMenuItemCard({
  itemId,
  itemName,
  itemImage,
  itemDescription,
  itemPrice,
  itemVariation,
  is_deliverable,
  delivery_locations,
}: MenuItemCardProps) {
  const { openModal } = useMenuItemModalStore();
  const session = useSession();

  const MenuItem = {
    id: itemId,
    name: itemName,
    price: itemPrice,
    image: itemImage,
    description: itemDescription,
    itemVariation: itemVariation,
    is_deliverable: is_deliverable,
    delivery_locations: delivery_locations,
  };

  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = () => {
    if (!session.data) {
      setShowLoginModal(true);
      return null;
    }

    // Get current path + query
    const currentPath = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Add/replace item param
    params.set("item", MenuItem.id.toString());

    // Open modal and remember where we came from
    openModal(MenuItem, currentPath + window.location.search);

    // Push to current page with ?item=12 instead of always /menu
    router.push(`${currentPath}?${params.toString()}`, { scroll: false });
  };

  return (
    <motion.div
      key={MenuItem.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1 }}
    >
      <Card className="bg-foreground p-4 rounded-sm hover:bg-theme cursor-pointer transition-shadow duration-300">
        {showLoginModal && (
          <LoginModal
            open={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
        )}
        <div
          className="flex flex-row sm:items-center sm:justify-between sm:gap-4"
          onClick={handleClick}
        >
          <div className="flex items-center sm:items-center gap-4 flex-1">
            <div
              className="min-w-[70px] min-h-[70px] w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-red-500 flex items-center justify-center text-white font-bold"
              style={{
                backgroundImage: `url(${itemImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="flex flex-col">
              <h2 className="text-base sm:text-lg font-semibold text-accent line-clamp-1">
                {itemName}
              </h2>
              <p className="text-xs md:text-sm text-accent/60 mt-1 sm:mt-2 line-clamp-3">
                {itemDescription}
              </p>
            </div>
          </div>

          {/* Right: Price */}
          <div className="text-right flex items-center">
            <h1 className="text-lg md:text-2xl font-semibold text-accent">
              ${itemPrice}
            </h1>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
