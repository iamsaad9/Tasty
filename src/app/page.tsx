"use client";
import React from 'react'
import ReservationForm from '@/components/ReservationForm';
import { CarouselDemo } from '@/components/BgCarousel';
import About from '@/components/About';
import { MenuItem } from '@heroui/react';
import MenuItems from '@/components/MenuItems';
function Home() {
  return (
    <div>
     
        <div className='overflow-hidden -z-10 top-0 flex items-center justify-center '>
          <CarouselDemo/>

          </div>

          <ReservationForm/>

          <div className='w-full flex justify-center bg-foreground'>
            <About/>
          </div>

          <div className='w-full flex justify-center'>
              <MenuItems/>
          </div>

          <div className='h-[100vh] w-full flex items-center justify-center'>

          </div>

       
    </div>
  )
}

export default Home