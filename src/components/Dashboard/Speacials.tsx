import React from "react";
import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import FadeInSection from "../ui/scrollAnimated";
import { useMenuItems } from "@/app/hooks/useMenuItems";
import { MenuItem } from "@/types";

function Speacials() {
  const [specialItems, setSpecialItems] = useState<MenuItem[]>([]);
  const { data: MenuItems, isPending } = useMenuItems();

  const [offsetY, setOffsetY] = useState(0);

  const filterSpecialMenuItems = (data: MenuItem[]) => {
    return data.filter((item) => item.special === true).slice(0, 4);
  };

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    if (!isPending && MenuItems) {
      console.log("MenuItems", MenuItems);
      const filteredMenuItems = filterSpecialMenuItems(MenuItems);
      setSpecialItems(filteredMenuItems);
    }
  }, [isPending, MenuItems]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full">
      <div
        className="h-96 xl:h-[30rem] w-full flex items-center justify-center relative bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: `url('/images/parallexBg.jpg')`,
        }}
      >
        <div className="absolute h-full w-full bg-[#404044] opacity-40"></div>
        <FadeInSection className="text-4xl text-white font-semibold relative z-10 mb-10">
          Our Specialities
        </FadeInSection>
      </div>

      <div className="h-auto w-full  flex justify-center items-center pb-20">
        <Card className="h-auto w-[80%] 2xl:w-[60%] grid grid-cols-1 lg:grid-cols-2 -mt-20 z-1 rounded-none bg-transparent shadow-none">
          {specialItems.map((items) => (
            <FadeInSection
              key={items.id}
              className="flex flex-col-reverse md:grid md:grid-cols-2 w-full bg-foreground "
            >
              {/* Text Content */}
              <div className="h-60 md:h-auto w-full flex flex-col items-center justify-around p-5 lg:p-10 gap-4">
                <h1 className="text-black text-xl lg:text-2xl text-center">
                  {items.title}
                </h1>
                <p className="text-center text-secondary text-sm lg:text-md">
                  {items.description}
                </p>
                <p className="text-lg font-semibold text-theme">
                  FROM ${items.price}
                </p>
              </div>

              {/* Image */}
              <img
                src={items.image}
                alt={`Special Dish ${items.id}`}
                className="h-80 w-full object-cover"
              />
            </FadeInSection>
          ))}
        </Card>
      </div>
    </div>
  );
}

export default Speacials;
