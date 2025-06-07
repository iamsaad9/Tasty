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
import ReservationForm from "@/components/ReservationForm";

export function CarouselDemo() {
  return (
    <Carousel
      className="w-full mt-0"
      opts={{ loop: true }}
      plugins={[
        // Autoplay({
        //   delay: 5000,
        // }),
        Fade(),
      ]}
    >
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index}>
            <div>
              <Card>
                <CardContent
                  className="h-96 md:h-[80vh]  flex aspect-square items-center justify-center "
                  style={{
                    backgroundImage: `url('/images/BgCarousel/bg_${
                      index + 1
                    }.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                </CardContent>
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
