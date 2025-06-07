import React from "react";
import { Image } from "@heroui/react";
function About() {
  return (
    <div className="w-[100vw] lg:w-[90vw] xl:w-[80vw] flex sm:flex-row flex-col">
      <div className="sm:w-[50%]">
        <Image
          src={"/images/about.jpg"}
          alt="About Us"
          className="w-full h-auto rounded-none shadow-lg"
        />
      </div>

      <div className="p-5 lg:p-10  sm:w-[50%] flex flex-col justify-center gap-5 lg:gap-10 ">
        <div className="  w-full xl:w-[90%]">
          <h2 className="text-sm md:text-md lg:text-lg font-semibold mt-4 text-background/30">
            ABOUT TASTY
          </h2>
          <h1 className="text-2xl sm:text-xl md:text-2xl 2xl:text-4xl mt-2 text-accent">
            Our chef cooks the most delicious food for you
          </h1>
        </div>

        <div className="flex flex-col gap-2 lg:gap-5 w-full xl:w-[90%]">
          <p className="mt-2 text-accent/60 text-base sm:text-xs md:text-sm lg:text-medium  xl:text-lg ">
            Far far away, behind the word mountains, far from the countries
            Vokalia and Consonantia, there live the blind texts. Separated they
            live in Bookmarksgrove right at the coast of the Semantics, a large
            language ocean.
          </p>

          <p className="mt-2 text-accent/60 text-base sm:text-xs md:text-sm lg:text-medium  xl:text-lg ">
            A small river named Duden flows by their place and supplies it with
            the necessary regelialia. It is a paradisematic country, in which
            roasted parts of sentences fly into your mouth.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
