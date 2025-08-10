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
      <div className="w-[80vw] 2xl:w-[60vw] flex-col items-center justify-center mx-auto my-10">
        <ContactForm />
      <div className="w-full h-80">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.8607285014978!2d-73.99918662397272!3d40.74308997138901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bb6eb21615%3A0xbdd7182c23af20b5!2s198%20W%2021st%20St%2C%20New%20York%2C%20NY%2010011%2C%20USA!5e0!3m2!1sen!2s!4v1751991698122!5m2!1sen!2s" className="h-full w-full" style={{border:0}} loading="lazy" />
        </div>
      </div>
      <ImageGallery />
    </div>
  );
}

export default page;
