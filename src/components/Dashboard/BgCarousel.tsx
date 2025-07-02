import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button"; 
import { indie } from "@/components/utils/fonts"; 
import FadeInSection from "../ui/scrollAnimated";
import { Link } from "@heroui/react";

export function CarouselDemo() {
  const slides = [
    {
      id: 1,
      image: "/images/BgCarousel/bg_1.jpg",
      title: "Tasty & Delicious Food",
      showButton: true,
    },
    {
      id: 2,
      image: "/images/BgCarousel/bg_2.jpg",
      title: "Tasty & Delicious Food",
      showButton: true,
    },
    {
      id: 3,
      image: "/images/BgCarousel/bg_3.jpg",
      title: "Book a table for yourself at a time convenient for you",
      showButton: true, 
    },
  ];

  return (
    <Carousel className="w-full mt-0" opts={{ loop: true }} plugins={[Fade(), Autoplay({ delay: 5000, stopOnInteraction: false })]}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="relative w-full h-96 md:h-[80vh] cursor-pointer">
              <Card className="w-full h-full cursor-pointer">
                <div className="absolute inset-0 bg-black opacity-40 z-10" />

                <CardContent
                  className="h-full w-full bg-center bg-cover z-0 relative"
                  style={{
                    backgroundImage: `url('${slide.image}')`,
                  }}
                />
                <div className="absolute w-full h-full bg-[#404044] opacity-40"/>
                <FadeInSection className=" absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                  <h2 className={`${indie.className} w-[80%] md:w-[50%] text-white text-2xl md:text-7xl mt-10 mb-4`}>
                    {slide.title}
                  </h2>
                  {slide.showButton && (
                    <Link href="/menu" className="backdrop-blur-xs bg-transparent border-2 rounded-none border-foreground text-foreground px-2 md:px-10 py-3 mt-5 md:mt-15 text-sm md:text-xl cursor-pointer hover:bg-foreground hover:text-background transition-colors duration-300">ORDER NOW</Link>
                  )}
                </FadeInSection>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
