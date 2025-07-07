'use client';
import ImageGallery from '@/components/ImageGallery'
import PageBanner from '@/components/PageBanner';
import React from 'react'
import About from '@/components/Dashboard/About';
function AboutPage() {
  return (
    <div className='w-full'>
        <PageBanner title='About Us' image='/images/BgCarousel/bg_2.jpg'/>
        <div className='w-full flex items-center justify-center'>

        <About/>
        </div>
        <ImageGallery/>
    </div>
  )
}

export default AboutPage