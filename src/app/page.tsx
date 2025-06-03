"use client";
import React from 'react'
import ReservationForm from './components/ReservationForm';
import BackgroundImage from '@/app/assets/images/homeBg.jpg'
function Home() {
  return (
    <div>
      {/* <Image
        src={BackgroundImage.src}
        alt="Hero UI Logo"
        // width={200}
        // height={200}
        className="mx-auto absolute"
        /> */}

        <div style={{backgroundImage: `url(${BackgroundImage.src})`, height: '100vh',width:'100vw', backgroundSize: 'cover', backgroundPosition: 'center'}} className='fixed flex items-center justify-center -z-10 top-0'>
          <span className='text-7xl absolute top-50'>Tasty & Delicious Food</span>
        </div>

        <div className='mt-150 lg:px-10 bg-transparent'>
          <ReservationForm/>
        </div>

        <section className='flex items-center justify-center h-300 bg-white '>
          <div className='text-4xl font-bold text-white'>
            Welcome to Our Food Paradise
          </div>
          </section>
    </div>
  )
}

export default Home