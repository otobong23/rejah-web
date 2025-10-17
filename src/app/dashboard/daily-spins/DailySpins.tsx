'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React from 'react'
import spin_arrow from '@/assets/spin_arrow.png'
import spin_wheel from '@/assets/spin.png'

const DailySpins = () => {
   const router = useRouter();
   return (
      <div>
         <button onClick={() => router.back()} className='flex items-center gap-2 mb-4'>
            <Icon icon="mdi:chevron-left" className='text-3xl cursor-pointer' />
            Back
         </button>

         <h1 className='text-[#000914] text-[40px] font-bold text-center mb-1'>Daily Spin</h1>
         <p className='text-[#000914] text-sm text-center w-8/10 mx-auto mb-10'>Spin the wheel once a day to claim your daily reward</p>

         <button className='w-full py-[23px] text-white text-center text-lg font-semibold bg-[#0000FF] rounded-[20px] mb-12'>Spin now</button>

         <div className='flex justify-center mb-4'>
            <Image src={spin_arrow} alt='spin arrow' className='w-[53px] object-cover' />
         </div>
            <div className='animate-spin-slow origin-center transform'>
            <Image src={spin_wheel} alt='spin wheel' className='object-cover' />
         </div>
      </div>
   )
}

export default DailySpins