import React from "react";
import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import FadeInSection from "../ui/scrollAnimated";

function Speacials() {
  const specialItems = [
    {
      id: 1,
      title: "Beef Steak",
      description:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
      imageUrl: "/images/Specials/specials1.jpg",
      price: "10.00",
    },
    {
      id: 2,
      title: "Chopsuey",
      description:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
      imageUrl: "/images/Specials/specials2.jpg",
      price: "10.00",
    },
    {
      id: 3,
      title: "Beef Ribs Steak",
      description:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
      imageUrl: "/images/Specials/specials3.jpg",
      price: "10.00",
    },
    {
      id: 4,
      title: "Roasted Chicken",
      description:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
      imageUrl: "/images/Specials/specials4.jpg",
      price: "10.00",
    },
  ];

  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

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

      <div className="h-auto w-full bg-[var(--body-bg)] flex justify-center items-center pb-20">
        <Card className="h-auto w-[80%] 2xl:w-[60%] grid grid-cols-1 lg:grid-cols-2 -mt-20 z-1 rounded-none bg-transparent">
          {specialItems.map((items) => (
            <FadeInSection
              key={items.id}
              delay={items.id * 0.1}
              className="flex flex-col-reverse md:grid md:grid-cols-2 w-full bg-foreground"
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
                src={items.imageUrl}
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
