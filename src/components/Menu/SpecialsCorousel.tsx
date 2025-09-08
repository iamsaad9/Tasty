import React, { useState, useEffect } from "react";
import FadeInSection from "@/components/ui/scrollAnimated";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@heroui/react";
import Heading from "../Heading";
import { MenuItemCard } from "../MenuItemCard";
import { MenuItem } from "@/types";

interface SpecialsCorouselProps {
  showLogin?: () => void;
  menuItems: MenuItem[] | undefined;
  addItemToCart: (itemId: number) => void;
}

function SpecialsCorousel({
  showLogin,
  addItemToCart,
  menuItems,
}: SpecialsCorouselProps) {
  const [specialItems, setSpecialItems] = useState<MenuItem[]>([]);

  const filterSpecialMenuItems = (data: MenuItem[]) => {
    return data.filter((item) => item.special === true).slice(0, 4);
  };

  useEffect(() => {
    if (!menuItems) return;
    const filteredMenuItems = filterSpecialMenuItems(menuItems);
    setSpecialItems(filteredMenuItems);
  }, [menuItems]);

  return (
    <div className="w-full flex flex-col items-center justify-center mb-10">
      <Heading title="SPECIALS" subheading="Our Specialities" />

      <FadeInSection className="w-full flex items-center justify-center">
        <Carousel
          className="w-full relative"
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
          opts={{ loop: true }}
        >
          {/* Carousel Content */}
          <CarouselContent className="w-full">
            {specialItems
              .filter((i) => i.special === true)
              .map((item) => (
                <CarouselItem
                  key={item.id}
                  className="basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="p-2 sm:p-3 md:p-4 lg:p-5 flex justify-center">
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
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </FadeInSection>
    </div>
  );
}

export default SpecialsCorousel;
