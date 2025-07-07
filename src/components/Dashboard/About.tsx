import React from "react";
import { Image } from "@heroui/react";
import FadeInSection from "../ui/scrollAnimated";

function About() {
  return (
    <div className="w-[100vw] xl:w-[70vw] 2xl:w-[60vw] flex sm:flex-row flex-col">
      <div className="sm:w-[50%]">
        <Image
          src={"/images/about.jpg"}
          alt="About Us"
          className="w-full h-auto rounded-none shadow-lg"
        />
      </div>

      <FadeInSection className="sm:w-[50%] flex flex-col justify-start"> 
        <div className="p-5 sm:p-5 lg:p-10 xl:px-10 xl:py-5 w-full ">
          <h2 className="text-sm md:text-md lg:text-sm font-semibold mt-4 text-background/30">
            ABOUT TASTY
          </h2>
          <h1 className="text-xl sm:text-xl  lg:text-2xl 2xl:text-3xl mt-2 text-accent">
            Our chef cooks the most delicious food for you
          </h1>
        </div>

        <div className="px-5 lg:px-10 flex flex-col  lg:gap-5 w-full ">
          <p className="mt-2 text-accent/60 text-sm sm:text-xs md:text-medium lg:text-lg xl:text-base 2xl:text-lg ">
            Far far away, behind the word mountains, far from the countries
            Vokalia and Consonantia, there live the blind texts. Separated they
            live in Bookmarksgrove right at the coast of the Semantics, a large
            language ocean.
          </p>

          <p className="mt-2 text-accent/60 text-sm sm:text-xs md:text-medium lg:text-lg xl:text-base 2xl:text-lg ">
            A small river named Duden flows by their place and supplies it with
            the necessary regelialia. It is a paradisematic country, in which
            roasted parts of sentences fly into your mouth.
          </p>
        </div>
      </FadeInSection>
    </div>
  );
}

export default About;
