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
import MenuItemCard from "../MenuItemCard";
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

interface SpecialsCorouselProps {
  showLogin?: () => void;
  addItemToCart: (itemId: number) => void;
}

function SpecialsCorousel({ showLogin, addItemToCart }: SpecialsCorouselProps) {
  const [specialItems, setSpecialItems] = useState<MenuItems[]>([]);

  useEffect(() => {
    const fetchSpecial = async () => {
      const res = await fetch("/Data/menu.json");
      const data = await res.json();
      const specialItems = data;
      setSpecialItems(data);
    };

    fetchSpecial();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center mb-10">
      <Heading title="SPECIALS" subheading="Our Specialities" />

      <FadeInSection className="w-full flex items-center justify-center">
        <Carousel
          className="w-full relative flex flex-row justify-center items-center "
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
          opts={{ loop: true }}
        >
          {/* Left Button */}
          <CarouselPrevious className="z-10 backdrop-blur-lg bg-black/30 hover:bg-black/30 text-white hover:text-theme h-20 " />

          {/* Carousel Content */}
          <CarouselContent className="w-full mx-20 -ml-1 ">
            {specialItems
              .filter((i) => i.special === true)
              .map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-1 basis-1/1 sm:basis-1/3 lg:basis-1/5"
                >
                  <div className="p-1 flex justify-center">
                    <MenuItemCard
                      itemId={item.id}
                      itemName={item.title}
                      itemDescription={item.description}
                      itemImage={item.image}
                      itemPrice={item.price}
                    />
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>

          {/* Right Button */}
          <CarouselNext className=" z-10 backdrop-blur-lg bg-black/30 hover:bg-black/30 text-white hover:text-theme h-20 " />
        </Carousel>
      </FadeInSection>
    </div>
  );
}

export default SpecialsCorousel;
