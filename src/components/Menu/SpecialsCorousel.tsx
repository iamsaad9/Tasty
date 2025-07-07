import React, { useState,useEffect } from "react";
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
import LoginModal from "../LoginModal";
import Heading from "../Heading";
interface MenuItems {
  id:number,
  title:string,
  category:string,
  diet:string[],
  price:number,
  description:string,
  image:string,
  popularity:number,
  rating:number,
  special:boolean,
  delivery:{
    isDeliverable:boolean,
    estimatedTime:string,
    baseFee:number,
    freeAbove:number,
    minOrder:number,
    areas:[
      {
        name:string,
        postalCode:string,
        fee:number,
      }
    ]
  }
}

function SpecialsCorousel() {
  const [showLogin,setShowLogin] = useState(false);
  const [specialItems,setSpecialItems] = useState<MenuItems[]>([])

  useEffect(()=>{
    const fetchSpecial = async () => {
      const res = await fetch('/Data/menu.json');
      const data = await res.json();
      const specialItems = data
      setSpecialItems(data);
    }

    fetchSpecial();
  },[])
  return (
    <div className="w-full flex flex-col items-center justify-center mb-10">
       <Heading title="SPECIALS" subheading="Our Specialities"/>

      <FadeInSection className="w-full flex items-center justify-center">
        <Carousel className="w-full relative flex flex-row justify-center items-center " plugins={[ Autoplay({ delay: 3000, stopOnInteraction: false  }) ]} opts={{loop:true}}>
          {/* Left Button */}
          <CarouselPrevious className="z-10 backdrop-blur-lg bg-black/30 hover:bg-black/30 text-white hover:text-theme h-20 " />

          {/* Carousel Content */}
          <CarouselContent className="w-full mx-20 -ml-1 ">
            {specialItems.filter((i)=> i.special === true).map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-1 basis-1/1 sm:basis-1/3 lg:basis-1/5"
              >
                <div className="p-1 flex justify-center">
                  <Card className="rounded-2xl border-3 border-theme overflow-hidden transition-shadow duration-300 max-w-60 md:max-w-xs  group cursor-pointer" onClick={()=>setShowLogin(true)}>
                    <CardContent className="p-0">
                      <div className="h-48 md:h-auto md:aspect-square overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-2 md:p-4 flex flex-col gap-2 ">
                        <h3 className="text-md font-semibold text-accent line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-secondary line-clamp-2 lg:line-clamp-3">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-theme font-bold text-lg">
                            ${item.price}
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
    <LoginModal open={showLogin} onClose={()=>setShowLogin(false)}/>
    </div>
    
  );
}

export default SpecialsCorousel;
