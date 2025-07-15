"use client";
import React, { useEffect } from "react";
import { Card } from "@heroui/react";
import { CardContent } from "./ui/card";
import { useMenuItemModalStore } from "@/lib/store/menuItemModalStore";
import { useRouter } from "next/navigation";

interface Variations {
  type: string;
  name: string;
  price_multiplier: number;
}
interface MenuItemCardProps {
  itemId: number;
  itemName: string;
  itemImage: string;
  itemDescription: string;
  itemPrice: number;
  itemVariation: Variations[];
}

function MenuItemCard({
  itemId,
  itemName,
  itemImage,
  itemDescription,
  itemPrice,
  itemVariation,
}: MenuItemCardProps) {
  const { openModal } = useMenuItemModalStore();

  const MenuItem = {
    id: itemId,
    name: itemName,
    price: itemPrice,
    image: itemImage,
    description: itemDescription,
    itemVariation: itemVariation,
  };

  const router = useRouter();
  const handleClick = () => {
    const currentPath = window.location.pathname + window.location.search;
    openModal(MenuItem, currentPath); // Save previous location

    const params = new URLSearchParams(window.location.search);
    params.set("item", MenuItem.id.toString());
    router.push(`/menu?${params.toString()}`, { scroll: false });
  };

  useEffect(()=>{
    console.log("MenuItemCard rendered with item:", MenuItem);
  })
  return (
    <Card className="h-full rounded-2xl  md:max-w-xs border-2 md:border-3 border-theme overflow-hidden transition-shadow duration-300 group cursor-pointer">
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
              {/* <Button
                className="bg-theme text-white text-sm px-3 py-1 rounded-full hover:bg-theme-dark transition"
                onPress={() => handleAddtoCart(item.id)}
              >
                Add to Cart
              </Button> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MenuItemCard;
