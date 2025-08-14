"use client";
import React, { useState, useEffect } from "react";
import LocationForm from "@/components/Dashboard/LocationForm";
import { CarouselDemo } from "@/components/Dashboard/BgCarousel";
import About from "@/components/Dashboard/About";
import MenuItems from "@/components/Dashboard/MenuItems";
import Speacials from "@/components/Dashboard/Speacials";
import ImageGallery from "@/components/ImageGallery";
import LoadingScreen from "@/components/Loading";
function Home() {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div>
      <LoadingScreen showLoading={loading} />

      <div className="overflow-hidden -z-10 top-0 flex items-center justify-center ">
        <CarouselDemo />
      </div>

      <LocationForm />

      <div className="w-full flex justify-center bg-foreground">
        <About />
      </div>

      <div className="w-full flex justify-center z-10">
        <MenuItems showLoading={(val) => setLoading(val)} />
      </div>

      <div className="w-full flex items-center justify-center">
        <Speacials />
      </div>

      <div className="w-full flex items-center justify-center">
        <ImageGallery />
      </div>
    </div>
  );
}

export default Home;
