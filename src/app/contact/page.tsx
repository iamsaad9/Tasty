"use client";
import ImageGallery from "@/components/ImageGallery";
import PageBanner from "@/components/PageBanner";
import React from "react";
import About from "@/components/Dashboard/About";
import Heading from "@/components/Heading";
import AboutChefs from "@/components/About/AboutChefs";
import ContactForm from "@/components/Contact/ContactForm";
function page() {
  return (
    <div className="w-full">
      <PageBanner title="Contact Us" image="/images/BgCarousel/bg_3.jpg" />
      <div className="w-[80vw] 2xl:w-[60vw] flex items-center justify-center mx-auto my-10">
        <ContactForm />
      </div>
      <ImageGallery />
    </div>
  );
}

export default page;
