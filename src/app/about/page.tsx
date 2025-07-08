"use client";
import ImageGallery from "@/components/ImageGallery";
import PageBanner from "@/components/PageBanner";
import React from "react";
import About from "@/components/Dashboard/About";
import Heading from "@/components/Heading";
import AboutChefs from "@/components/About/AboutChefs";
function AboutPage() {
  return (
    <div className="w-full">
      <PageBanner title="About Us" image="/images/BgCarousel/bg_2.jpg" />
      <div className="w-full flex items-center justify-center">
        <About />
      </div>
      <Heading title="OUT CHEF" subheading="Our Master Chef" />
      <div className="w-[70vw] 2xl:w-[60vw] flex items-center justify-center mx-auto">
        <AboutChefs />
      </div>
      <ImageGallery />
    </div>
  );
}

export default AboutPage;
