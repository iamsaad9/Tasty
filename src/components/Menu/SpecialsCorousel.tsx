import React from "react";
import FadeInSection from "@/components/ui/scrollAnimated";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@heroui/react";
import Fade from "embla-carousel-fade";

function SpecialsCorousel() {
  return (
    <div className="w-full flex flex-col items-center justify-center my-10">
      <FadeInSection className="flex flex-col justify-center items-center gap-2 py-10">
        <h1 className="text-background/30 text-md font-semibold">SPECIALS</h1>
        <h1 className="text-accent text-center text-2xl sm:text-3xl font-semibold ">
           Our Specialities
        </h1>
      </FadeInSection>

      <FadeInSection className="w-full flex items-center justify-center">
        {/* <Carousel className="w-full relative flex flex-row justify-center items-center " plugins={[ Autoplay({ delay: 3000, stopOnInteraction: false  }) ]} opts={{loop:true}}> */}
        <Carousel className="w-[95%] sm:w-full relative flex flex-row justify-center items-center">
          {/* Left Button */}
          <CarouselPrevious className="z-10 backdrop-blur-lg bg-black/30 hover:bg-black/30 text-white hover:text-theme h-20 " />

          {/* Carousel Content */}
          <CarouselContent className="w-full mx-20 -ml-1 ">
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="pl-1 basis-1/1 sm:basis-1/3 lg:basis-1/5"
              >
                <div className="p-1 flex justify-center">
                  <Card className="rounded-2xl border-3 border-theme overflow-hidden transition-shadow duration-300 max-w-xs group cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-[1/1] overflow-hidden">
                        <img
                          src={`/images/Specials/specials${index + 1}.jpg`}
                          alt={`Special ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4 flex flex-col gap-2 ">
                        <h3 className="text-lg font-semibold text-accent">
                          Special Dish {index + 1}
                        </h3>
                        <p className="text-sm text-secondary">
                          A delicious blend of fresh ingredients made to
                          perfection.
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-theme font-bold text-lg">
                            $12.99
                          </span>
                          <Button className="bg-theme text-white text-sm px-3 py-1 rounded-full hover:bg-theme-dark transition">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
