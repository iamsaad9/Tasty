"use client";
import React from "react";
import FadeInSection from "@/components/ui/scrollAnimated";
import { indie } from "@/components/utils/fonts";
import SpecialsCorousel from "@/components/Menu/SpecialsCorousel";

function MenuPage() {
 
  return (
    <div className="w-full">
      {/* Background Section */}
      <div className='bg-[url("/images/menupageBg.jpg")] bg-cover bg-center h-72 md:h-[30rem] flex items-center justify-center relative'>
        <div className="absolute w-full h-full bg-[#404044] opacity-50" />
        <FadeInSection className=" absolute flex flex-col items-center justify-center text-center px-4">
          <h2
            className={`${indie.className}  text-white text-2xl md:text-7xl mt-10 mb-4`}
          >
            Discover Our Exclusive Menu
          </h2>
        </FadeInSection>
      </div>
      <SpecialsCorousel />
    </div>
  );    
}

export default MenuPage;
