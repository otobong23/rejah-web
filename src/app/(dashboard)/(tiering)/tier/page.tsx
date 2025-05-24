'use client';
import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image';
import React from 'react'
import poly from '@/assets/Tier/PolyCycle.png'

const BUTTON_LIST = [
   { title: 'Rebound', icon: 'icon-park-twotone:five-star-badge', iconColor: '#10B981' },
   { title: 'Premium', icon: 'icon-park-solid:five-star-badge', iconColor: '#F59E0B' },
]

const Tier = () => {
   const [activeTier, setActiveTier] = React.useState('Rebound');
   return (
      <div>
         <div className={`bg-(--color2) text-(--color1) rounded-xl py-[23px] px-[25px] relative`}>
            <h3 className="text-[10px] font-light mb-1.5 flex items-center gap-1.5">
               <Icon icon='mdi:chevron-left' className="text-2xl" />
               <span>Shape Your Journey.</span>
            </h3>
            <div className="flex items-center gap-1.5">
               <Icon icon='fa:recycle' className="text-4xl" />
               <h1 className="text-3xl lg:text-4xl font-bold">Pick Your Tier.</h1>
            </div>
            <p className="text-sm mt-1">No matter your level, every pack contributes to purpose-driven transformation.</p>
         </div>

         <div className="flex items-center gap-3 mt-3">
            {BUTTON_LIST.map(({ title, icon, iconColor }, index) => (
               <button onClick={() => setActiveTier(title)} key={index} className={`text-(--color2) rounded-[20px] px-4 py-5 flex-1 flex justify-center items-center gap-5 
               ${activeTier === title ? 'bg-(--color1) drop-shadow-2xl drop-shadow-[#6B6B6B40]/25' : 'bg-[#002732]'} transition-all duration-300
               `}>
                  <Icon icon={icon} className="text-2xl" color={iconColor} />
                  <div className="flex flex-col items-end">
                     <span className="text-lg font-semibold">{title}</span>
                     <span className='text-[9px]'>Tiers</span>
                  </div>
               </button>
            ))}
         </div>

         <div className="bg-[#03242f] text-white rounded-xl p-4 w-80 shadow-lg border border-teal-800">
            <h2 className="text-lg font-semibold mb-3">PolyCycle</h2>

            <div className="flex items-center mb-4">
               <Image
                  src={poly}
                  alt="PolyCycle"
                  className="w-24 h-full object-cover mr-4"
               />
               <div className="text-sm space-y-1">
                  <p>
                     <span className="text-white/70">Price:</span>{" "}
                     <span className="font-semibold">$10</span>
                  </p>
                  <p>
                     <span className="text-white/70">Daily Yield:</span>{" "}
                     <span className="font-semibold">$0.50</span>
                  </p>
                  <p>
                     <span className="text-white/70">Duration:</span>{" "}
                     <span className="font-semibold">30 Days</span>
                  </p>
                  <p>
                     <span className="text-white/70">ROI:</span>{" "}
                     <span className="font-semibold">$15</span>
                  </p>
                  <p>
                     <span className="text-white/70">Purchase limit:</span>{" "}
                     <span className="font-semibold">1</span>
                  </p>
               </div>
            </div>

            <button className="w-full bg-gray-300 text-black font-medium py-1.5 rounded-lg hover:bg-gray-400 transition">
               Buy
            </button>
         </div>
      </div>
   )
}

export default Tier