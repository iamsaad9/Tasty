import React from 'react'
import FadeInSection from "@/components/ui/scrollAnimated";
import { indie } from "@/components/utils/fonts";

interface PageBannerProps {
  title?: string;
  image?: string;
}

function PageBanner({title,image}:PageBannerProps) {
  return (
    <div className='w-full'>
         <div className={`bg-cover bg-center h-72 md:h-[30rem] flex items-center justify-center relative`} style={{ backgroundImage: `url(${image})` }}>
        <div className="absolute w-full h-full bg-[#404044] opacity-50" />
        <FadeInSection className=" absolute flex flex-col items-center justify-center text-center px-4">
          <h2
            className={`${indie.className}  text-white text-2xl md:text-7xl mt-10 mb-4`}
          >
           {title}
          </h2>
        </FadeInSection>
      </div>
    </div>
  )
}

export default PageBanner