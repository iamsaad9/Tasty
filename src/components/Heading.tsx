import React from 'react'
import FadeInSection from './ui/scrollAnimated'

interface HeadingProps{
    title:string,
    subheading:string,
}
function Heading({title,subheading}:HeadingProps) {
  return (
    <div>
         <FadeInSection className="flex flex-col justify-center items-center gap-2 py-14">
                <h1 className="text-background/30 text-md font-semibold">{title}</h1>
                <h1 className="text-accent text-center text-2xl sm:text-3xl font-semibold ">
                  {subheading}
                </h1>
              </FadeInSection>
    </div>
  )
}

export default Heading